export async function http<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'HTTP error');
  }

  if (res.status === 204) return undefined as T;

  return res.json();
} 