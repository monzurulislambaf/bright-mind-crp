export function cn(
  ...inputs: Array<string | false | null | undefined>
): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Mongoose stores Buffer-typed fields as BSON Binary. Read back with
 * `.lean()`, the value is a `Binary` object (bytes live on `.buffer` and
 * `.length` is a method), not a Node Buffer. Normalise so callers always
 * receive a plain Buffer.
 */
export function toBuffer(value: unknown): Buffer | undefined {
  if (value == null) return undefined;
  if (Buffer.isBuffer(value)) return value;
  if (
    typeof value === "object" &&
    "buffer" in (value as Record<string, unknown>) &&
    Buffer.isBuffer((value as { buffer: Buffer }).buffer)
  ) {
    return (value as { buffer: Buffer }).buffer;
  }
  return undefined;
}