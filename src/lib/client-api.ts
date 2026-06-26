export async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { ...options, headers: { "content-type": "application/json", ...(options.headers ?? {}) } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error ?? `Request failed (${response.status})`) as Error & { details?: unknown };
    error.details = payload.details;
    throw error;
  }
  return payload.data as T;
}
