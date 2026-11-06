import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { getAllCertifications } from "../api/certifications";
import type { CertificationsByVendor } from "../types/certification";
import { FloatingThemeToggle } from "../components/FloatingThemeToggle";
import { imageUrl } from "../utils/images";
import { VENDOR_LABELS } from "../constants";
import { VENDOR_TOKENS } from "../theme/tokens";

/** Home: i question bank trovati dall'API, un tab per vendor. */
export function CertificationsPage() {
  const navigate = useNavigate();
  const { theme, tokens: t } = useTheme();
  const [catalog, setCatalog] = useState<CertificationsByVendor | null>(null);
  const [error, setError] = useState(false);
  const [vendor, setVendor] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    getAllCertifications()
      .then(setCatalog)
      .catch((err) => {
        console.error("Impossibile caricare il catalogo delle certificazioni:", err);
        setError(true);
      });
  }, []);

  const vendors = catalog ? Object.keys(catalog) : [];
  const selected = vendor ?? vendors[0];

  return (
    <>
      <FloatingThemeToggle />
      {/* Stessa intestazione e stessi aloni della pagina di una certificazione (ModeSelectPage), nei colori neutri di base. */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: `${t.modeBg}, ${t.bg}` }}>
        <div style={{ position: "absolute", top: -180, left: -120, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${t.glowA}, transparent 70%)`, filter: "blur(10px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -220, right: -160, width: 640, height: 640, borderRadius: "50%", background: `radial-gradient(circle, ${t.glowB}, transparent 70%)`, filter: "blur(10px)", pointerEvents: "none" }} />
        <div style={{ width: "100%", maxWidth: 760, position: "relative" }}>
          <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: t.fa, fontWeight: 600 }}>
            Question banks
          </div>
          {/* backgroundImage e non background: aggiornando la shorthand al cambio di tema React azzererebbe il clip sul testo. */}
          <h1 style={{
            fontFamily: "Roboto, 'IBM Plex Sans', sans-serif", fontWeight: 700, fontSize: 46, lineHeight: 1.1,
            margin: "14px 0 10px", letterSpacing: "-.01em", backgroundImage: t.hero,
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          }}>
            Certification Simulator
          </h1>
          <p style={{ margin: "0 0 36px", color: t.mu, fontSize: 16, lineHeight: 1.55, maxWidth: "52ch" }}>
            Choose the certification to work on.
          </p>

          {error && <p style={{ margin: 0, color: t.er, fontSize: 14 }}>Could not load the certifications.</p>}
          {catalog && vendors.length === 0 && <p style={{ margin: 0, color: t.mu, fontSize: 14 }}>No question bank found.</p>}

          {catalog && selected && (
            <>
              {/* Tab dei vendor: rettangoli appoggiati su una linea lunga, la selezionata sottolineata dal gradiente del titolo. */}
              <div role="tablist" style={{ display: "flex", flexWrap: "wrap", gap: 4, borderBottom: `1px solid ${t.bd3}`, marginBottom: 24 }}>
                {vendors.map((v) => {
                  const active = v === selected;
                  return (
                    <button
                      key={v}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setVendor(v)}
                      style={{
                        position: "relative", padding: "11px 22px", marginBottom: -1, borderRadius: "8px 8px 0 0",
                        border: "none", background: active ? t.card : "transparent", font: "inherit", fontSize: 14.5,
                        fontWeight: 600, color: active ? t.tx : t.mu,
                      }}
                    >
                      {VENDOR_LABELS[v] ?? v.charAt(0).toUpperCase() + v.slice(1)}
                      {active && (
                        <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, borderRadius: 2, backgroundImage: t.hero }} />
                      )}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
                {catalog[selected].map((c) => {
                  // Sotto il mouse la card si accende del colore del suo vendor, come il tab.
                  const glow = hoveredCard === c.id ? VENDOR_TOKENS[c.vendor]?.[theme].ac : undefined;
                  return (
                    <button
                      key={c.id}
                      onClick={() => navigate(`/${c.id}`)}
                      onMouseEnter={() => setHoveredCard(c.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        textAlign: "left", background: t.card, border: `1px solid ${glow ?? t.bd}`, borderRadius: 14,
                        padding: "30px 32px", color: "inherit", font: "inherit",
                        boxShadow: glow ? `0 0 0 1px ${glow}, 0 8px 28px ${glow}40` : `0 1px 2px ${t.sh}`,
                        transition: "border-color .18s, box-shadow .18s",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22 }}>
                        {/* alt vuoto: codice e nome sono scritti sotto. badge.png e' facoltativo: senza, niente immagine rotta. */}
                        <img
                          src={imageUrl(`${c.id}/badge.png`)}
                          alt=""
                          // Solo l'altezza: i badge non sono tutti quadrati (TA-004 e' 300x360).
                          height={128}
                          style={{ width: "auto", flexShrink: 0, display: "block" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div>
                          <div style={{ fontSize: 26, fontWeight: 700 }}>{c.code}</div>
                          <div style={{ color: t.mu, fontSize: 16, lineHeight: 1.5, marginTop: 6 }}>{c.name}</div>
                          <p style={{ margin: "16px 0 0", color: t.tx2, fontSize: 14.5 }}>
                            {`${c.questionCount} questions · exam: ${c.examQuestionCount} questions, ${c.examTimeLimitMinutes} min`}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
