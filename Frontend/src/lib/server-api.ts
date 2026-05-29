const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

type ApiEnvelope<T> = {
  data?: T;
};

export async function serverGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return null;
    }

    const json = (await res.json()) as ApiEnvelope<T>;
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function serverGetList<T>(path: string): Promise<T[]> {
  const data = await serverGet<T | T[]>(path);
  if (!data) return [];
  return Array.isArray(data) ? data : [];
}
