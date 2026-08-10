import "server-only";
import { connectToDatabase } from "@/lib/db";
import { IdSequence } from "@/models/IdSequence";

export type IdKind =
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
  | "RPT"
  | "ONB"
  | "QUO"
  | "INV"
  | "PAY"
  | "AUD"
  | "CMP";

const YEAR_BASED: ReadonlySet<IdKind> = new Set([
  "QL",
  "CASE",
  "TSK",
  "TKT",
  "APT",
  "RPT",
]);

function pad(value: number, length = 6): string {
  return String(value).padStart(length, "0");
}

function yearSuffix(): string {
  return String(new Date().getFullYear());
}

function randomSegment(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function prefixFor(kind: IdKind): string {
  return `BM-${kind}`;
}

/**
 * Builds a unique identifier such as BM-CASE-2026-000123.
 * Prefer `nextId()` for production creates (atomic sequence).
 */
export function buildId(kind: IdKind, seq?: number): string {
  const p = pad(seq ?? Math.floor(Math.random() * 999999) + 1);
  if (YEAR_BASED.has(kind)) {
    return `BM-${kind}-${yearSuffix()}-${p}`;
  }
  return `BM-${kind}-${p}`;
}

/** year-tagged ID used for quality leads, cases, tasks, tickets and appointments. */
export function buildYearId(
  kind: "QL" | "CASE" | "TSK" | "TKT" | "APT" | "RPT",
  seq?: number
): string {
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

/**
 * Atomically allocate the next system ID via idSequences (design §27).
 * IDs are server-generated and immutable.
 */
export async function nextId(kind: IdKind): Promise<string> {
  await connectToDatabase();
  const yearBased = YEAR_BASED.has(kind);
  const year = yearBased ? new Date().getFullYear() : undefined;
  const key = yearBased ? `${kind}-${year}` : kind;
  const prefix = prefixFor(kind);

  const doc = await IdSequence.findOneAndUpdate(
    { key },
    {
      $inc: { currentNumber: 1 },
      $setOnInsert: { prefix, yearBased, year },
      $set: { updatedAt: new Date() },
    },
    { upsert: true, new: true }
  ).lean();

  const n = doc?.currentNumber ?? 1;
  if (yearBased) {
    return `${prefix}-${year}-${pad(n)}`;
  }
  return `${prefix}-${pad(n)}`;
}
