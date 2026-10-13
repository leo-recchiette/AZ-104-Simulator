import { useTheme } from "../theme/ThemeContext";
import { splitExplanation, splitUrls, type ExplanationBlock } from "../utils/explanation";

interface ExplanationTextProps {
  text: string;
}

type ListKind = "box" | "step";

interface ListGroup {
  kind: ListKind;
  blocks: ExplanationBlock[];
}

/**
 * Vedi utils/explanation.ts. I "Box N" consecutivi, uno per riga di risposta, diventano un elenco
 * puntato; gli "Step N", uno per passo di una sequenza, un elenco numerato.
 */
export function ExplanationText({ text }: ExplanationTextProps) {
  const { tokens: t } = useTheme();
  const groups: (ExplanationBlock | ListGroup)[] = [];
  for (const block of splitExplanation(text)) {
    const kind = listKind(block);
    const last = groups[groups.length - 1];
    if (kind === null) groups.push(block);
    else if (last && "kind" in last && last.kind === kind) last.blocks.push(block);
    else groups.push({ kind, blocks: [block] });
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {groups.map((group, i) =>
        "kind" in group ? (
          <ul key={i} style={{ display: "grid", gap: 6, margin: 0, padding: "0 0 0 4px", listStyle: "none" }}>
            {group.blocks.map((block, j) => (
              <li key={j} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10 }}>
                {/* Il marcatore sta fuori dal testo: le voci vanno a capo restando allineate fra loro. */}
                <span aria-hidden style={{ color: t.ac, fontWeight: group.kind === "step" ? 700 : undefined }}>
                  {group.kind === "step" ? `${block.lead?.slice("Step ".length)}.` : "•"}
                </span>
                <div>
                  <BlockText block={block} showLead={group.kind === "box"} />
                </div>
              </li>
            ))}
          </ul>
        ) : group.lead === "Reference" ? (
          <div key={i} style={{ textAlign: "left" }}>
            <strong style={{ fontWeight: 700 }}>Reference:</strong>
            {splitUrls(group.text)
              .filter((segment) => segment.text.trim() !== "")
              .map((segment, j) => (
                <div key={j}>{segment.url ? <UrlText url={segment.text} /> : segment.text.trim()}</div>
              ))}
          </div>
        ) : (
          <div key={i}>
            <BlockText block={group} showLead />
          </div>
        ),
      )}
    </div>
  );
}

function listKind(block: ExplanationBlock): ListKind | null {
  if (block.lead?.startsWith("Box ")) return "box";
  if (block.lead?.startsWith("Step ")) return "step";
  return null;
}

/** Negli elenchi numerati il numero fa gia' da etichetta: "Step N:" non si ripete. */
function BlockText({ block, showLead }: { block: ExplanationBlock; showLead: boolean }) {
  const lead = showLead ? block.lead : null;
  return (
    <>
      {lead && <strong style={{ fontWeight: 700 }}>{lead}:</strong>}
      {lead && block.text ? " " : ""}
      {splitUrls(block.text).map((segment, j) =>
        segment.url ? <UrlText key={j} url={segment.text} /> : segment.text,
      )}
    </>
  );
}

function UrlText({ url }: { url: string }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" style={{ color: "inherit", fontStyle: "italic", overflowWrap: "anywhere" }}>
      {url}
    </a>
  );
}
