/**
 * Shared upload constraints for portal attachments. Imported by both the
 * client-side form (validation/UX) and the server action (enforcement) so
 * the two can never drift apart.
 */
export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB per file

/** Only common document types are accepted for client attachments. */
export const ACCEPTED_MIME_TYPES: string[] = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "text/plain",
  "application/rtf",
  "application/vnd.oasis.opendocument.text",
];

/** `accept` attribute value for the file input. */
export const ACCEPT_ATTR = ACCEPTED_MIME_TYPES.join(",");
