import { Fragment } from "react";
import { splitPlaceholders } from "../utils/placeholders";

interface PlaceholderTextProps {
  text: string;
}

/** Vedi utils/placeholders.ts. */
export function PlaceholderText({ text }: PlaceholderTextProps) {
  return (
    <>
      {splitPlaceholders(text).map((part, i) =>
        part.placeholder ? (
          <strong key={i} style={{ fontWeight: 700 }}>
            {part.text}
          </strong>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}
