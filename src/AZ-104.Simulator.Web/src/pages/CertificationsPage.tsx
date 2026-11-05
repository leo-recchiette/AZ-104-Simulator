import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { getAllCertifications } from "../api/certifications";
import type { CertificationsByVendor } from "../types/certification";
import { FloatingThemeToggle } from "../components/FloatingThemeToggle";
import { FilterPill } from "../components/FilterPill";
import { CERTIFICATION_HOME, CERTIFICATION_ID } from "../constants";
import { MODE_BG_GRADIENT } from "../theme/tokens";

/** Home: i question bank trovati dall'API, un tab per vendor. */
export function CertificationsPage() {
  const navigate = useNavigate();
  const { theme, tokens: t } = useTheme();
  const [catalog, setCatalog] = useState<CertificationsByVendor | null>(null);
  const [error, setError] = useState(false);
  const [vendor, setVendor] = useState<string | null>(null);

  useEffect(() => {
    getAllCertifications()
      .then(setCatalog)
      .catch((err) => {
        console.error("Impossibile caricare il catalogo delle certificazioni:", err);
        setError(true);
      });
  }, []);

  const vendors = catalog ? Object.keys(catalog) : [];
  // Finche' non se ne sceglie uno: il tab di CERTIFICATION_ID, l'unica con le sue pagine; altrimenti il primo.
  const selected = vendor ?? vendors.find((v) => catalog?.[v].some((c) => c.id === CERTIFICATION_ID)) ?? vendors[0];

  return (
    <>
      <FloatingThemeToggle />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: `${theme === "dark" ? MODE_BG_GRADIENT.dark : MODE_BG_GRADIENT.light}, ${t.bg}` }}>
        <div style={{ width: "100%", maxWidth: 760 }}>
          <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 34, margin: "0 0 8px" }}>Certifications</h1>
          <p style={{ margin: "0 0 28px", color: t.mu, fontSize: 15.5 }}>Choose the question bank to work on.</p>

          {error && <p style={{ margin: 0, color: t.er, fontSize: 14 }}>Could not load the certifications.</p>}
          {catalog && vendors.length === 0 && <p style={{ margin: 0, color: t.mu, fontSize: 14 }}>No question bank found.</p>}

          {catalog && selected && (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {vendors.map((v) => (
                  <FilterPill key={v} active={v === selected} onClick={() => setVendor(v)} label={v.charAt(0).toUpperCase() + v.slice(1)} />
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
                {catalog[selected].map((c) => {
                  // shortcut: solo CERTIFICATION_ID ha le sue pagine, finche' la certificazione non arriva dalla rotta.
                  const available = c.id === CERTIFICATION_ID;
                  return (
                    <button
                      key={c.id}
                      disabled={!available}
                      onClick={() => navigate(CERTIFICATION_HOME)}
                      style={{
                        textAlign: "left", background: t.card, border: `1px solid ${t.bd}`, borderRadius: 14,
                        padding: "22px 22px 20px", boxShadow: `0 1px 2px ${t.sh}`, color: "inherit", font: "inherit",
                        opacity: available ? 1 : 0.55,
                      }}
                    >
                      <div style={{ fontSize: 19, fontWeight: 600 }}>{c.id}</div>
                      <p style={{ margin: "10px 0 0", color: t.tx2, fontSize: 13 }}>
                        {`${c.questionCount} questions · exam: ${c.examQuestionCount} questions, ${c.examTimeLimitMinutes} min`}
                      </p>
                      {!available && <p style={{ margin: "6px 0 0", color: t.fa, fontSize: 12.5 }}>Not available yet</p>}
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
