import crypto from "crypto";

// A URL-safe random token used as a bearer credential (e.g. the self-service
// edit link) — not a slug, not meant to be guessable. 24 bytes -> 48 hex chars.
export function generateToken(): string {
  return crypto.randomBytes(24).toString("hex");
}
