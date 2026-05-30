const BASE_URL = process.env.BUILDSTACK_BASE_URL ?? "https://stack.builddeck.io";
const PROJECT_KEY = process.env.BUILDSTACK_PROJECT_KEY ?? "builddeck-server";
const API_KEY = process.env.BUILDSTACK_API_KEY ?? "";

export async function bsApi<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}/api/v1/${PROJECT_KEY}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...(options.headers ?? {}),
    },
  });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload as T;
}
