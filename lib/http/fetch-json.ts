export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    // Ensure auth cookies are included consistently (helps across dev/proxy setups).
    credentials: "include",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const body = (await res.json()) as unknown;
        if (body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string") {
          message = (body as { error: string }).error;
        }
      } else {
        const text = await res.text();
        if (text) message = text;
      }
    } catch {
      // ignore parse errors and keep fallback message
    }

    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}
