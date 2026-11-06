# Certification Simulator

An exam simulator for IT certifications, one question bank per certification: today Microsoft AZ-104 (Azure
Administrator Associate, 584 items) and HashiCorp Terraform Associate 004 (167 items). The home page lists them
with a tab per vendor; each certification has its own Practice, Simulation and history, with its exam rules
(questions and time limit) and its vendor's colours. .NET 10 Web API, PostgreSQL, React + TypeScript — the whole
stack runs in Docker, so nothing has to be installed locally except Docker itself. The API lists the certifications
it finds in the database at `GET /api/certifications/getAllCertifications`.

## Screenshots

Home screen: the certifications found in the database, one tab per vendor, each with its exam rules.

![Certifications](docs/screenshots/certifications.png)

A certification's page: pick a mode and see where your Simulations stand — worst and best score, the average of the last five
and how many you have passed in a row. The chart of every session can be zoomed on a period by dragging across it,
and its score axis fits the scores shown.

![Home screen](docs/screenshots/home.png)

A question during a practice session, with its attached screenshot (*exhibit*) open and the solution available on
demand. This one belongs to a scenario series, so its linked questions are listed alongside. *Save to study later*
marks it for after the session; *Flag for review* is for coming back to it before submitting.

![A question during a session](docs/screenshots/question.png)

History of submitted sessions: open any past attempt to go through its questions, your answers and the solutions.

![Session history](docs/screenshots/history.png)

Inside a past attempt: every question with your answer, the solution and its explanation, filtered here to the
questions you saved to study later together with the ones you got wrong.

![A past attempt, filtered](docs/screenshots/attempt.png)

## What it does

- **Two modes.** *Practice* lets you choose how many questions you want — or go open-ended and stop whenever you
  like, scoring only what you answered — whether to run a clock, and whether the solution should appear on its own
  as soon as you answer. *Simulation* is a fixed timed set under exam conditions.
- **Microsoft's own partial credit rule**: one point per correctly answered component, nothing deducted for wrong
  ones, so a single mistake never zeroes out a multi-part question. Drag-and-drop sequences are scored by position,
  while the few that ask *which* objects to pick are scored as a set, in any order.
- **Moving around a session**: Previous/Next or the ← → keys, a question panel that can show only the unanswered or
  the flagged questions, and *Flag for review* for the ones to check again before submitting.
- **Exhibits**: the screenshots that come with a question are shown inline and can be zoomed in and out, since many
  of them are small and dense.
- **History and progress**: every submitted session is kept with its questions and answers. The home screen charts
  them all — zoomable on a period by dragging across it — and sums up your Simulations: worst, best, average of the
  last five and passes in a row.
- **Study later**: mark any question during a session with *Save to study later*, then find it in the review at the
  end of the session and in the history, where it can also be listed together with the questions you got wrong.
- **Sessions survive an interruption.** The session in progress is saved as you go, so a reload, a closed tab or a
  laptop lid coming down doesn't cost you your answers — and the clock stops while the app is away. Each
  certification keeps its own: you can leave an AZ-104 session halfway, work on Terraform and come back to it.

## Project layout

```
AZ-104.Simulator.sln               .NET solution (API + tests)
src/
  AZ-104.Simulator.Api/            .NET Web API
  AZ-104.Simulator.Web/            React + TypeScript frontend
  AZ-104.Simulator.Importer/       question bank importer (Python)
tests/
  AZ-104.Simulator.Api.Tests/      API unit tests
db/                                SQL schema
dataset/<vendor>/<certification>/  source data, one folder per certification (dataset/microsoft/az-104/,
                                     dataset/hashicorp/terraform-associate-004/):
                                     questions.json, certificationSettings.json (code, name, exam question count, time limit),
                                     questions.md (human-readable version), images.zip (exhibits),
                                     badge.png (optional, served at /images/<certification>/badge.png).
                                     The folder name is the certification id stored with its questions
docs/screenshots/                  the images in this README
docker-compose.yml
```

Each folder under `src/` is one Docker service: `api`, `web` and `importer`.

## Getting started

### First run

```bash
docker compose --profile setup run --rm importer
docker compose up -d
```

The first command creates everything it needs on its own — volume, database, schema — waits until it is ready and
imports the question banks, 584 AZ-104 and 167 Terraform Associate questions: nothing else has to be started by
hand beforehand. The second one brings up the API and
the frontend, which by then find a populated database.

The API is served at **http://localhost:5080**, with interactive documentation at **http://localhost:5080/swagger**.
The frontend is at **http://localhost:5173**.

### Subsequent runs

```bash
docker compose up -d
```

The database and the questions live in a Docker volume, so this command is all it takes — no need to run the
importer again. That is only necessary after a `docker compose down -v` (which wipes the volume), or when you want
to reload the question bank from an updated JSON file.

### Reloading the question bank

The importer replaces the contents of the question tables with every `questions.json` it finds under
`dataset/<vendor>/<certification>/` — all certifications at once, it is not incremental. Each question is tagged
with the name of its folder (`az-104`), and its exhibits are served from `/images/<certification>/`. Note that the
JSON is **copied into the importer image** at build time rather than mounted, so after editing the dataset rerun
it with `--build`, otherwise the stale copy gets imported again:

```bash
docker compose --profile setup run --rm --build importer
```

### Optional services

```bash
docker compose --profile dev up -d pgweb
```

A browser-based SQL client at http://localhost:8081, handy for inspecting the database without installing anything.

### History backup

[`db/history_backup.sql`](db/history_backup.sql) is the backup of my personal session history.

### Starting over (when something gets stuck)

When something jams (an image that won't update, stale frontend code, a broken `node_modules`), tear everything
down and start again:

```bash
docker compose --profile dev --profile setup down -v --rmi local --remove-orphans
docker compose --profile setup run --rm importer
docker compose up -d
```

`-v` also wipes `pgdata`, so the history and the sessions in progress go with it: the importer only brings the
questions back. If `docker rmi` refuses because a stopped container still uses the image, find it with
`docker ps -a` and remove it with `docker rm <container>`.

## Tests

```bash
dotnet test AZ-104.Simulator.sln
```

Two test projects:

- `tests/AZ-104.Simulator.Api.Tests` — unit tests: the repositories are substituted, no database needed.
- `tests/AZ-104.Simulator.Api.IntegrationTests` — the API is started in memory (`WebApplicationFactory`) and called
  over HTTP, route by route, against a real Postgres seeded with a small question bank (`Data/seed.sql`). Responses
  are compared with approved [Verify](https://github.com/VerifyTests/Verify) snapshots, the `*.verified.txt` files
  next to the tests: when a response changes on purpose, review the `*.received.txt` Verify writes and rename it
  to `.verified.txt`.

The integration tests empty the database before every test, so they only run against a database named
`simulator_tests` — the one the [build pipeline](#build-pipeline) starts — and are skipped against anything else,
the development database included. The simplest way to run everything is therefore:

```bash
make setup build test teardown
```

## Build pipeline

Build and tests run in a container with the .NET 10 SDK and Node, created at the start and removed at the end.
GitHub Actions runs the same Makefile targets.

| File | What it does |
|---|---|
| `pipeline.dockerfile` | build image: .NET 10 SDK on Alpine, plus Node and npm |
| `docker-compose.pipeline.yml` | starts the build container `az-104-simulator-pipeline`, with the repo mounted on `/work`, and a throwaway Postgres (`simulator_tests`, no published port) for the integration tests |
| `Makefile` | pipeline targets, each one runs commands in the container: `build` compiles the backend and builds the frontend, `test` runs the .NET unit and integration tests and the frontend lint |
| `.github/workflows/ci.yml` | GitHub Actions pipeline, on every push and pull request: `setup` → `build` → `test` (no `teardown`: the GitHub machine is destroyed at the end of the run) |

To run the whole pipeline locally:

```bash
make setup build test teardown
```

## Handy commands

```bash
docker compose --profile dev up -d    # start every service, pgweb included (without --profile it stays down)
docker compose down -v                # wipe everything, database volume (and session history) included
docker compose stop pgweb             # stop a service behind a profile (it has to be named explicitly)
docker compose --profile dev down     # full cleanup, services behind profiles included
```

<br>
<br>

<p align="center">
  <img src="https://img.shields.io/badge/AZ--104-PASSED_%C2%B7_842%2F1000-2ea44f?style=for-the-badge" alt="AZ-104 passed with 842/1000">
  <br>
  <sub><i>I passed AZ-104 on 22 October 2026 with a score of 842 :D</i></sub>
  <br>
  <br>
  <img src="https://img.shields.io/badge/TA--004-LOADING...-7b42bc?style=for-the-badge" alt="TA-004 loading">
</p>
