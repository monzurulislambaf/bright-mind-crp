type IdKind =
  | "USR"
  | "LEAD"
  | "QL"
  | "CON"
  | "ORG"
  | "SOL"
  | "PSY"
  | "CLI"
  | "CASE"
  | "DOC"
  | "APT"
  | "TSK"
  | "TKT"
  | "RPT";

function pad(value: number, length = 6): string {
  return String(value).padStart(length, "0");
}

function yearSuffix(): string {
  return String(new Date().getFullYear());
}

function randomSegment(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

/**
 * Builds a unique identifier such as BM-CASE-2026-000123.
 * Deterministic-prefix generators (USR, LEAD, etc.) accept a sequence number.
 */
export function buildId(kind: IdKind, seq?: number): string {
  const p = pad(seq ?? Math.floor(Math.random() * 999999) + 1);
  switch (kind) {
    case "USR":
      return `BM-USR-${p}`;
    case "LEAD":
      return `BM-LEAD-${p}`;
    case "CON":
      return `BM-CON-${p}`;
    case "ORG":
      return `BM-ORG-${p}`;
    case "SOL":
      return `BM-SOL-${p}`;
    case "PSY":
      return `BM-PSY-${p}`;
    case "CLI":
      return `BM-CLI-${p}`;
    case "DOC":
      return `BM-DOC-${p}`;
    case "APT":
      return `BM-APT-${yearSuffix()}-${p}`;
    case "RPT":
      return `BM-RPT-${yearSuffix()}-${p}`;
    default:
      return `BM-${kind}-${yearSuffix()}-${p}`;
  }
}

/** year-tagged ID used for quality leads, cases, tasks, tickets and appointments. */
export function buildYearId(kind: "QL" | "CASE" | "TSK" | "TKT" | "APT" | "RPT", seq?: number): string {
  return `BM-${kind}-${yearSuffix()}-${pad(seq ?? Math.floor(Math.random() * 999999) + 1)}`;
}

/** Collision-safe ID with a random segment appended. */
export function buildSecureId(kind: IdKind, seq?: number): string {
  return `${buildId(kind, seq)}-${randomSegment()}`;
}

/** Create a unique reference for tokens such as file uploads. */
export function buildToken(): string {
  return `${Date.now().toString(36)}${randomSegment()}${randomSegment()}`;
}