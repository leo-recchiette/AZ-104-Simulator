const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/** Percorso dato dall'API (es. "az-104/q020_pre0.png") -> URL servito da app.UseStaticFiles su wwwroot/images. */
export function imageUrl(path: string): string {
  return `${BASE_URL}/images/${path}`;
}
