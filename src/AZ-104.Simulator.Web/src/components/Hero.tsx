import type { ReactNode } from "react";
import { useTheme } from "../theme/ThemeContext";
import { imageUrl } from "../utils/images";

/** Sfondo del catalogo e della pagina di una certificazione: gradiente e due aloni sfocati, nei colori del tema o del vendor. */
export function HeroBackdrop({ children }: { children: ReactNode }) {
  const { tokens: t } = useTheme();
  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: `${t.modeBg}, ${t.bg}` }}>
      <div style={{ position: "absolute", top: -180, left: -120, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${t.glowA}, transparent 70%)`, filter: "blur(10px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -220, right: -160, width: 640, height: 640, borderRadius: "50%", background: `radial-gradient(circle, ${t.glowB}, transparent 70%)`, filter: "blur(10px)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 760, position: "relative" }}>{children}</div>
    </div>
  );
}

/** Occhiello e titolo col gradiente del tema. */
export function HeroTitle({ eyebrow, children }: { eyebrow: ReactNode; children: ReactNode }) {
  const { tokens: t } = useTheme();
  return (
    <>
      <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: t.fa, fontWeight: 600 }}>{eyebrow}</div>
      {/* backgroundImage e non background: aggiornando la shorthand al cambio di tema React azzererebbe il clip sul testo. */}
      <h1 style={{
        fontFamily: "Roboto, 'IBM Plex Sans', sans-serif", fontWeight: 700, fontSize: 46, lineHeight: 1.1,
        margin: "14px 0 10px", letterSpacing: "-.01em", backgroundImage: t.hero,
        WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
      }}>
        {children}
      </h1>
    </>
  );
}

/**
 * badge.png della certificazione in un riquadro 128x128 riservato: niente salto di layout al caricamento, e un badge
 * non quadrato (TA-004 e' 300x360) ci sta dentro senza deformarsi. Il file e' facoltativo: se manca, l'immagine sparisce.
 */
export function CertificationBadge({ certificationId, alt, align }: { certificationId: string; alt: string; align: "left" | "right" }) {
  return (
    <img
      src={imageUrl(`${certificationId}/badge.png`)}
      alt={alt}
      width={128}
      height={128}
      style={{ flexShrink: 0, display: "block", objectFit: "contain", objectPosition: align }}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
