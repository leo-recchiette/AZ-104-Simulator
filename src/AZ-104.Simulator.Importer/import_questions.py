"""Importa i question bank delle certificazioni da JSON a PostgreSQL.

Ogni certificazione ha la sua cartella, <dataset>/<vendor>/<certificazione>/questions.json, e il nome
della cartella diventa il certification_id delle sue domande. Il JSON e' ground truth: se cambia forma
si aggiorna questo script, non il JSON.

Uso:
    python import_questions.py              legge tutti i JSON e popola il database
    python import_questions.py --dry-run     legge e conta, senza toccare il DB
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

import psycopg

DATASET_DIR = os.environ.get("DATASET_DIR", "/data")
DATABASE_URL = os.environ.get(
    "DATABASE_URL", "postgresql://simulator:simulator@db:5432/simulator"
)

MULTIPLE_CHOICE = "multiple_choice"
ORDERED_ANSWER = "ordered_answer"


def find_datasets(root: Path) -> dict[str, Path]:
    """certification_id -> questions.json. L'id e' il nome della cartella, unico anche fra vendor diversi."""
    datasets: dict[str, Path] = {}
    for path in sorted(root.glob("*/*/questions.json")):
        certification_id = path.parent.name
        if certification_id in datasets:
            raise SystemExit(f"certificazione {certification_id} doppia: {datasets[certification_id]} e {path}")
        datasets[certification_id] = path
    return datasets


def load_questions(path: Path) -> list[dict]:
    return json.loads(path.read_text(encoding="utf-8"))


def connect(database_url: str, attempts: int = 15, delay_seconds: float = 2.0) -> psycopg.Connection:
    """Si collega al database, riprovando finche' non e' pronto ad accettare connessioni."""
    for attempt in range(1, attempts + 1):
        try:
            return psycopg.connect(database_url)
        except psycopg.OperationalError as error:
            print(f"  database non pronto (tentativo {attempt}/{attempts}): {error}")
            time.sleep(delay_seconds)
    raise SystemExit("database irraggiungibile")


def insert_question(cur: psycopg.Cursor, vendor: str, certification_id: str, q: dict) -> int:
    cur.execute(
        """
        INSERT INTO questions (vendor, certification_id, number, type, answer_layout, question, explanation,
                               answer_text, note, source, group_id, group_type, variant_group,
                               unordered_answer)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        (
            vendor,
            certification_id,
            q["id"],
            q["type"],
            q.get("answer_layout"),
            q["question"],
            q["explanation"],
            q["answer_text"],
            q.get("note"),
            q["source"],
            q.get("group_id"),
            q.get("group_type"),
            q.get("variant_group"),
            q.get("unordered_answer", False),
        ),
    )
    return cur.fetchone()[0]


def insert_option_pool(cur: psycopg.Cursor, question_id: int, items: list[tuple[str | None, str, bool]]) -> None:
    """is_correct = appartiene alla risposta; la posizione sta in answer_rows.ord."""
    for ord_, (letter, text, is_correct) in enumerate(items):
        cur.execute(
            """
            INSERT INTO options (question_id, ord, letter, text, is_correct)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (question_id, ord_, letter, text, is_correct),
        )


def insert_ordered_sequence(cur: psycopg.Cursor, question_id: int, answer_items: list[str]) -> None:
    """Prompt NULL: l'ordine stesso e' la risposta."""
    for ord_, item_text in enumerate(answer_items):
        cur.execute(
            """
            INSERT INTO answer_rows (question_id, ord, prompt, answer)
            VALUES (%s, %s, NULL, %s)
            """,
            (question_id, ord_, item_text),
        )


def insert_answer_rows(cur: psycopg.Cursor, question_id: int, rows: list[dict]) -> None:
    """Le chiavi dipendono dal tipo: 'prompt'/'selected' oppure 'statement'/'answer'."""
    for ord_, row in enumerate(rows):
        prompt = row.get("prompt", row.get("statement"))
        answer = row.get("selected", row.get("answer"))
        cur.execute(
            """
            INSERT INTO answer_rows (question_id, ord, prompt, answer)
            VALUES (%s, %s, %s, %s)
            RETURNING id
            """,
            (question_id, ord_, prompt, answer),
        )
        answer_row_id = cur.fetchone()[0]

        options = row.get("options")
        if options:
            for opt_ord, option_text in enumerate(options):
                cur.execute(
                    """
                    INSERT INTO answer_row_options (answer_row_id, ord, text)
                    VALUES (%s, %s, %s)
                    """,
                    (answer_row_id, opt_ord, option_text),
                )


def insert_images(cur: psycopg.Cursor, question_id: int, q: dict) -> None:
    """images_question -> kind 'question', images_answer -> kind 'answer'."""
    for ord_, filename in enumerate(q.get("images_question", [])):
        cur.execute(
            """
            INSERT INTO question_images (question_id, kind, ord, filename)
            VALUES (%s, 'question', %s, %s)
            """,
            (question_id, ord_, filename),
        )
    for ord_, filename in enumerate(q.get("images_answer", [])):
        cur.execute(
            """
            INSERT INTO question_images (question_id, kind, ord, filename)
            VALUES (%s, 'answer', %s, %s)
            """,
            (question_id, ord_, filename),
        )


def find_selection_mismatches(questions: list[dict]) -> list[tuple[int, str | None, str]]:
    """Righe 'selection' la cui risposta non compare nel proprio pool."""
    mismatches = []
    for q in questions:
        for row in q.get("answer_rows", []):
            options = row.get("options")
            if options is None:
                continue
            answer = row.get("selected", row.get("answer"))
            if answer not in options:
                mismatches.append((q["id"], row.get("prompt", row.get("statement")), answer))
    return mismatches


def find_group_mismatches(questions: list[dict]) -> list[tuple[str, list[int], list[int]]]:
    """Gruppi in cui "group_members" non combacia con i membri reali del group_id."""
    by_group: dict[str, list[int]] = {}
    declared: dict[str, list[int]] = {}
    for q in questions:
        group_id = q.get("group_id")
        if not group_id:
            continue
        by_group.setdefault(group_id, []).append(q["id"])
        declared.setdefault(group_id, sorted(q.get("group_members") or []))

    mismatches = []
    for group_id, actual in by_group.items():
        if sorted(actual) != declared[group_id]:
            mismatches.append((group_id, sorted(actual), declared[group_id]))
    return mismatches


def find_variant_mismatches(questions: list[dict]) -> list[list[tuple[int, str | None]]]:
    """Domande con lo stesso testo che non stanno nella stessa variant_group, o variant_group con testi diversi."""
    by_text: dict[str, list[tuple[int, str | None]]] = {}
    by_variant: dict[str, set[str]] = {}
    for q in questions:
        text = " ".join(q["question"].split())
        variant_group = q.get("variant_group")
        by_text.setdefault(text, []).append((q["id"], variant_group))
        if variant_group:
            by_variant.setdefault(variant_group, set()).add(text)

    mismatches = [
        members
        for members in by_text.values()
        if len(members) > 1 and (len({v for _, v in members}) > 1 or members[0][1] is None)
    ]
    for variant_group, texts in by_variant.items():
        if len(texts) > 1:
            mismatches.append([(q["id"], variant_group) for q in questions if q.get("variant_group") == variant_group])
    return mismatches


def import_all(conn: psycopg.Connection, datasets: dict[str, Path], banks: dict[str, list[dict]]) -> None:
    """Il database rispecchia il dataset: si reimportano tutte le certificazioni insieme."""
    with conn, conn.cursor() as cur:
        cur.execute("TRUNCATE questions RESTART IDENTITY CASCADE")
        for certification_id, questions in banks.items():
            # <vendor>/<certificazione>/questions.json: il vendor e' la cartella sopra quella della certificazione.
            vendor = datasets[certification_id].parent.parent.name
            for q in questions:
                question_id = insert_question(cur, vendor, certification_id, q)
                insert_images(cur, question_id, q)
                if q["type"] == MULTIPLE_CHOICE:
                    correct_letters = set(q["correct_answers"])
                    items = [(o["letter"], o["text"], o["letter"] in correct_letters) for o in q["options"]]
                    insert_option_pool(cur, question_id, items)
                elif q.get("answer_layout") == ORDERED_ANSWER:
                    correct_items = set(q["answer_items"])
                    items = [(None, text, text in correct_items) for text in q["all_actions"]]
                    insert_option_pool(cur, question_id, items)
                    insert_ordered_sequence(cur, question_id, q["answer_items"])
                else:
                    insert_answer_rows(cur, question_id, q.get("answer_rows", []))


def report_warnings(questions: list[dict]) -> None:
    unverified = [q for q in questions if not q.get("verified")]
    if unverified:
        numbers = ", ".join(str(q["id"]) for q in unverified[:10])
        print(f"  attenzione: {len(unverified)} domande non verificate ({numbers}...)", file=sys.stderr)

    mismatches = find_selection_mismatches(questions)
    if mismatches:
        numbers = ", ".join(str(question_id) for question_id, _, _ in mismatches[:10])
        print(
            f"  attenzione: {len(mismatches)} righe con risposta non presente nel proprio pool di opzioni "
            f"({numbers}...)",
            file=sys.stderr,
        )

    group_mismatches = find_group_mismatches(questions)
    if group_mismatches:
        for group_id, actual, declared in group_mismatches[:10]:
            print(
                f"  attenzione: gruppo {group_id} incoerente - membri reali {actual}, dichiarati {declared}",
                file=sys.stderr,
            )

    variant_mismatches = find_variant_mismatches(questions)
    if variant_mismatches:
        for members in variant_mismatches[:10]:
            described = ", ".join(f"{question_id} ({variant_group})" for question_id, variant_group in members)
            print(f"  attenzione: varianti incoerenti - {described}", file=sys.stderr)


def main() -> int:
    argp = argparse.ArgumentParser(description="Importa i question bank delle certificazioni.")
    argp.add_argument("--dry-run", action="store_true", help="non scrivere sul database")
    args = argp.parse_args()

    datasets = find_datasets(Path(DATASET_DIR))
    if not datasets:
        raise SystemExit(f"nessun questions.json in {DATASET_DIR}/<vendor>/<certificazione>/")

    banks: dict[str, list[dict]] = {}
    for certification_id, path in datasets.items():
        print(f"{certification_id}: lettura di {path}")
        questions = load_questions(path)
        print(f"  {len(questions)} domande lette")
        report_warnings(questions)
        banks[certification_id] = questions

    if args.dry_run:
        print("dry run: database non toccato")
        return 0

    conn = connect(DATABASE_URL)
    import_all(conn, datasets, banks)
    counts = ", ".join(f"{certification_id} {len(questions)}" for certification_id, questions in banks.items())
    print(f"importate le domande ({counts}) su {DATABASE_URL.rsplit('@', 1)[-1]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
