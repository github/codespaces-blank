// ---------------------------------------------------------------------------
// URL validation helpers (extracted for testability)
// ---------------------------------------------------------------------------

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^\[::1\]$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /\.local$/i,
  /^0\.0\.0\.0$/,
  /^169\.254\.169\.254$/,
];

/**
 * Validate an ICS calendar URL.
 * Returns `{ ok: true }` if valid, `{ ok: false, reason: string }` otherwise.
 */
export function validateIcsUrl(raw: string): { ok: true } | { ok: false; reason: string } {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { ok: false, reason: "Invalid URL" };
  }

  if (!["https:", "webcal:"].includes(parsed.protocol)) {
    return { ok: false, reason: "Only https:// and webcal:// URLs are allowed" };
  }

  const host = parsed.hostname;
  for (const pattern of PRIVATE_HOST_PATTERNS) {
    if (pattern.test(host)) {
      return { ok: false, reason: "Internal URLs are not allowed" };
    }
  }

  return { ok: true };
}
