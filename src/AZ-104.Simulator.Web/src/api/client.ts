const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`API ${status}: ${body}`);
  }
}

/** La fetch comune: header JSON e un ApiError col testo della risposta se lo status non e' 2xx. */
async function send(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    throw new ApiError(res.status, await res.text().catch(() => ""));
  }
  return res;
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  return (await send(path, init)).json() as Promise<T>;
}

/** Come request, ma un 204 diventa null. */
export async function requestOptional<T>(path: string, init?: RequestInit): Promise<T | null> {
  const res = await send(path, init);
  return res.status === 204 ? null : ((await res.json()) as T);
}

/** Per gli endpoint che rispondono 204 e basta (salvataggio e cancellazione della sessione). */
export async function requestVoid(path: string, init?: RequestInit): Promise<void> {
  await send(path, init);
}
