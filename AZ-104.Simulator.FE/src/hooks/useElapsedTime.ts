import { useEffect, useState } from "react";

/**
 * Ricalcolato da Date.now() a ogni tick, cosi' resta giusto anche con un tab in background; in
 * pausa resta fermo a pausedAt. Le pause gia' finite stanno in startedAt (RESUME lo sposta avanti).
 * Mai nel SessionContext: il tick rirenderizzerebbe tutta la domanda.
 */
export function useElapsedTime(startedAt: number | null, pausedAt: number | null = null, intervalMs = 1000): number {
  const [elapsedMs, setElapsedMs] = useState(() => (startedAt !== null ? (pausedAt ?? Date.now()) - startedAt : 0));

  useEffect(() => {
    if (startedAt === null) return;

    const read = () => setElapsedMs((pausedAt ?? Date.now()) - startedAt);
    read();
    if (pausedAt !== null) return;
    const id = setInterval(read, intervalMs);
    return () => clearInterval(id);
  }, [startedAt, pausedAt, intervalMs]);

  return elapsedMs;
}
