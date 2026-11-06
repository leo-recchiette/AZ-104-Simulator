import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { getAllCertifications } from "../api/certifications";
import type { CertificationsByVendor } from "../types/certification";
import { FloatingThemeToggle } from "../components/FloatingThemeToggle";
import { FilterPill } from "../components/FilterPill";
import { imageUrl } from "../utils/images";
import { VENDOR_LABELS } from "../constants";

/** Home: i question bank trovati dall'API, un tab per vendor. */
export function CertificationsPage() {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();
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
  const selected = vendor ?? vendors[0];

  return (
    <>
      <FloatingThemeToggle />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: `${t.modeBg}, ${t.bg}` }}>
        <div style={{ width: "100%", maxWidth: 760 }}>
          <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 34, margin: "0 0 8px" }}>Certifications</h1>
          <p style={{ margin: "0 0 28px", color: t.mu, fontSize: 15.5 }}>Choose the question bank to work on.</p>

          {error && <p style={{ margin: 0, color: t.er, fontSize: 14 }}>Could not load the certifications.</p>}
          {catalog && vendors.length === 0 && <p style={{ margin: 0, color: t.mu, fontSize: 14 }}>No question bank found.</p>}

          {catalog && selected && (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {vendors.map((v) => (
                  <FilterPill key={v} active={v === selected} onClick={() => setVendor(v)} label={VENDOR_LABELS[v] ?? v.charAt(0).toUpperCase() + v.slice(1)} />
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
                {catalog[selected].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/${c.id}`)}
                    style={{
                      textAlign: "left", background: t.card, border: `1px solid ${t.bd}`, borderRadius: 14,
                      padding: "22px 22px 20px", boxShadow: `0 1px 2px ${t.sh}`, color: "inherit", font: "inherit",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      {/* alt vuoto: codice e nome sono scritti accanto. badge.png e' facoltativo: senza, niente immagine rotta. */}
                      <img
                        src={imageUrl(`${c.id}/badge.png`)}
                        alt=""
                        width={64}
                        height={64}
                        style={{ flexShrink: 0, display: "block" }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div>
                        <div style={{ fontSize: 19, fontWeight: 600 }}>{c.code}</div>
                        <div style={{ color: t.mu, fontSize: 13.5, lineHeight: 1.45, marginTop: 2 }}>{c.name}</div>
                      </div>
                    </div>
                    <p style={{ margin: "14px 0 0", color: t.tx2, fontSize: 13 }}>
                      {`${c.questionCount} questions · exam: ${c.examQuestionCount} questions, ${c.examTimeLimitMinutes} min`}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
