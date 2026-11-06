import { requestOptional, requestVoid } from "./client";
import type { ActiveSessionDto, SaveActiveSessionDto } from "../types/session";

/** null quando non c'e' nessuna sessione da riprendere (il server risponde 204). */
export function getActiveSession(certificationId: string): Promise<ActiveSessionDto | null> {
  return requestOptional<ActiveSessionDto>(`/api/sessions/getCurrentSession?${new URLSearchParams({ certificationId })}`);
}

/** keepalive: la richiesta parte anche mentre la pagina si chiude. */
export function saveActiveSession(session: SaveActiveSessionDto, keepalive = false): Promise<void> {
  return requestVoid("/api/sessions/saveCurrentSession", {
    method: "PUT",
    body: JSON.stringify(session),
    keepalive,
  });
}

export function deleteActiveSession(certificationId: string): Promise<void> {
  return requestVoid(`/api/sessions/deleteCurrentSession?${new URLSearchParams({ certificationId })}`, { method: "DELETE" });
}
