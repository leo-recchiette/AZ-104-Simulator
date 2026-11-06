import { useEffect, useState, type ReactNode } from "react";
import { Navigate, Outlet, Route, Routes, useOutletContext, useParams } from "react-router-dom";
import { SessionProvider, useSession } from "./session/SessionContext";
import { useTheme, VendorTheme } from "./theme/ThemeContext";
import { getAllCertifications } from "./api/certifications";
import type { CertificationDto } from "./types/certification";
import { CertificationsPage } from "./pages/CertificationsPage";
import { ModeSelectPage } from "./pages/ModeSelectPage";
import { PracticeSetupPage } from "./pages/PracticeSetupPage";
import { SimulationSetupPage } from "./pages/SimulationSetupPage";
import { SessionPage } from "./pages/SessionPage";
import { ResultsPage } from "./pages/ResultsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AttemptDetailPage } from "./pages/AttemptDetailPage";

/** Aspetta il ripristino prima di decidere, altrimenti un reload rimanderebbe indietro. Senza sessione si torna alla certificazione. */
function RequireSession({ children }: { children: ReactNode }) {
  const certification = useOutletContext<CertificationDto>();
  const { state, restoring } = useSession();
  if (restoring) return <LoadingScreen text="Restoring your session..." />;
  if (state.questions.length === 0) return <Navigate to={`/${certification.id}`} replace />;
  return <>{children}</>;
}

/**
 * Le pagine di una certificazione: la cerca nel catalogo e la passa alle figlie con useOutletContext.
 * Rilegge il catalogo anche dopo un reload, quando non si e' passati dalla home.
 */
function CertificationLayout() {
  const { certificationId } = useParams();
  // undefined = in caricamento, null = non esiste (o il catalogo non si carica): si torna al catalogo.
  const [certification, setCertification] = useState<CertificationDto | null>();

  useEffect(() => {
    getAllCertifications()
      .then((catalog) => setCertification(Object.values(catalog).flat().find((c) => c.id === certificationId) ?? null))
      .catch((err) => {
        console.error("Impossibile caricare la certificazione:", err);
        setCertification(null);
      });
  }, [certificationId]);

  // Anche quando l'id dell'URL cambia senza smontare il layout: le pagine non devono girare con la certificazione vecchia.
  if (certification === undefined || (certification !== null && certification.id !== certificationId)) return <LoadingScreen text="Loading..." />;
  if (certification === null) return <Navigate to="/" replace />;
  return (
    <VendorTheme vendor={certification.vendor}>
      {/* key: cambiando certificazione si riparte da zero, con il ripristino della sua sessione. */}
      <SessionProvider key={certification.id} certificationId={certification.id}>
        <Outlet context={certification} />
      </SessionProvider>
    </VendorTheme>
  );
}

function LoadingScreen({ text }: { text: string }) {
  const { tokens: t } = useTheme();
  return (
    <div style={{ flex: 1, display: "grid", placeItems: "center", padding: 48, color: t.mu, fontSize: 14 }}>
      {text}
    </div>
  );
}

export function App() {
  const { tokens: t } = useTheme();
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: t.bg, color: t.tx, transition: "background .2s, color .2s" }}>
      <Routes>
        <Route path="/" element={<CertificationsPage />} />
        <Route path="/:certificationId" element={<CertificationLayout />}>
          <Route index element={<ModeSelectPage />} />
          <Route path="practice/setup" element={<PracticeSetupPage />} />
          <Route path="simulation/setup" element={<SimulationSetupPage />} />
          {/* Fuori da RequireSession: lo storico si legge dal database, non dalla sessione in corso. */}
          <Route path="history" element={<HistoryPage />} />
          <Route path="history/:id" element={<AttemptDetailPage />} />
          <Route
            path="session"
            element={
              <RequireSession>
                <SessionPage />
              </RequireSession>
            }
          />
          <Route
            path="results"
            element={
              <RequireSession>
                <ResultsPage />
              </RequireSession>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}
