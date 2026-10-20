/**
 * Segnaposto del dataset ("[answer choice]", "[box 1]", "(box 1)", "Box 1" a inizio riga), resi in
 * grassetto nel punto esatto in cui stanno, come nell'answer area dell'esame. Pattern volutamente
 * stretto: le quadre non devono toccare i frammenti ARM ("[parameters('location')]"), e "Box 1:"
 * nelle explanation è prosa. Il gruppo di cattura fa restare i segnaposto nell'output di split().
 */
const PLACEHOLDER = /(\[(?:answer choice|box \d+)\]|\(box\s*\d+\)|(?<=^|\n|\s\|\s)box\s*\d+\b(?!\s*:))/i;

export interface TextPart {
  text: string;
  placeholder: boolean;
}

/** "(box 1)" e "Box 1" diventano "[Box 1]"; "[answer choice]" resta com'è, maiuscola compresa. */
function normalizeToken(raw: string): string {
  const box = /box\s*(\d+)/i.exec(raw);
  return box ? `[Box ${box[1]}]` : raw;
}

export function splitPlaceholders(text: string): TextPart[] {
  return text
    .split(PLACEHOLDER)
    .map((part, i) => (i % 2 === 1 ? { text: normalizeToken(part), placeholder: true } : { text: part, placeholder: false }))
    .filter((part) => part.text !== "");
}
