const HANDLE_REGEX = /^[a-z0-9-]{3,30}$/;

export const RESERVED_HANDLES = [
  "www",
  "app",
  "api",
  "admin",
  "dashboard",
  "marketing",
  "auth",
  "support",
] as const;

export type HandleValidationResult =
  | {
      ok: true;
      value: string;
    }
  | {
      ok: false;
      code: "invalid_format" | "reserved_name";
      message: string;
    };

export function normalizeHandle(input: string) {
  return input.trim().toLowerCase();
}

export function validateHandle(input: string): HandleValidationResult {
  const normalized = normalizeHandle(input);

  if (!HANDLE_REGEX.test(normalized)) {
    return {
      ok: false,
      code: "invalid_format",
      message:
        "Handle must be 3–30 characters and contain only lowercase letters, numbers, or hyphens.",
    };
  }

  if (RESERVED_HANDLES.includes(normalized as (typeof RESERVED_HANDLES)[number])) {
    return {
      ok: false,
      code: "reserved_name",
      message: "This handle is reserved. Please choose another one.",
    };
  }

  return {
    ok: true,
    value: normalized,
  };
}


export type SubdomainValidationResult =
  | {
      ok: true;
      value: string;
    }
  | {
      ok: false;
      code: "invalid_format" | "reserved_name";
      message: string;
    };

export function validateSubdomain(input: string): SubdomainValidationResult {
  const normalized = normalizeHandle(input);

  if (!HANDLE_REGEX.test(normalized)) {
    return {
      ok: false,
      code: "invalid_format",
      message:
        "Subdomain must be 3–30 characters and contain only lowercase letters, numbers, or hyphens.",
    };
  }

  if (RESERVED_HANDLES.includes(normalized as (typeof RESERVED_HANDLES)[number])) {
    return {
      ok: false,
      code: "reserved_name",
      message: "This subdomain is reserved. Please choose another one.",
    };
  }

  return {
    ok: true,
    value: normalized,
  };
}
