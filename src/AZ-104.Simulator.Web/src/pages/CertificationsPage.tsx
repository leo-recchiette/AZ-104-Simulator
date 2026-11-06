import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, VendorTheme } from "../theme/ThemeContext";
import { getAllCertifications } from "../api/certifications";
import type { CertificationDto, CertificationsByVendor } from "../types/certification";
import { FloatingThemeToggle } from "../components/FloatingThemeToggle";
import { CertificationBadge, HeroBackdrop, HeroTitle } from "../components/Hero";
import { VENDOR_LABELS } from "../constants";

/** Home: i question bank trovati dall'API, un tab per vendor. */
export function CertificationsPage() {
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
      {/* Stessa intestazione e stessi aloni della pagina di una certificazione, nei colori di base del tema. */}
      <HeroBackdrop>
        <HeroTitle eyebrow="Question banks">Certification Simulator</HeroTitle>
        <p style={{ margin: "0 0 36px", color: t.mu, fontSize: 16, lineHeight: 1.55, maxWidth: "52ch" }}>
          Choose the certification to work on.
        </p>

        {error && <p style={{ margin: 0, color: t.er, fontSize: 14 }}>Could not load the certifications.</p>}
        {catalog && vendors.length === 0 && <p style={{ margin: 0, color: t.mu, fontSize: 14 }}>No question bank found.</p>}

        {catalog && selected && (
          <>
            {/* Pulsanti a forma di tab: rettangoli appoggiati su una linea lunga, il selezionato sottolineato dal gradiente del titolo. */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, borderBottom: `1px solid ${t.bd3}`, marginBottom: 24 }}>
              {vendors.map((v) => {
                const active = v === selected;
                return (
                  <button
                    key={v}
                    aria-pressed={active}
                    onClick={() => setVendor(v)}
                    style={{
                      position: "relative", padding: "11px 22px", marginBottom: -1, borderRadius: "8px 8px 0 0",
                      border: "none", background: active ? t.card : "transparent", fontSize: 14.5,
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
              {catalog[selected].map((c) => (
                <VendorTheme key={c.id} vendor={c.vendor}>
                  <CertificationCard certification={c} />
                </VendorTheme>
              ))}
            </div>
          </>
        )}
      </HeroBackdrop>
    </>
  );
}

/** Dentro il VendorTheme del suo vendor: sotto il mouse o col focus si accende del suo accento. */
function CertificationCard({ certification: c }: { certification: CertificationDto }) {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();
  const [lit, setLit] = useState(false);
  return (
    <button
      onClick={() => navigate(`/${c.id}`)}
      onMouseEnter={() => setLit(true)}
      onMouseLeave={() => setLit(false)}
      onFocus={() => setLit(true)}
      onBlur={() => setLit(false)}
      style={{
        width: "100%", textAlign: "left", background: t.card, border: `1px solid ${lit ? t.ac : t.bd}`, borderRadius: 14,
        padding: "30px 32px", color: "inherit",
        // color-mix e non un alpha in coda: funziona con qualsiasi formato di colore di t.ac.
        boxShadow: lit ? `0 0 0 1px ${t.ac}, 0 8px 28px color-mix(in srgb, ${t.ac} 25%, transparent)` : `0 1px 2px ${t.sh}`,
        transition: "border-color .18s, box-shadow .18s",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22 }}>
        {/* alt vuoto: codice e nome sono scritti sotto. */}
        <CertificationBadge certificationId={c.id} alt="" align="left" />
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
}
