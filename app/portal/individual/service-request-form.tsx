"use client";

import { useActionState, useState } from "react";
import { submitServiceRequest, type PortalActionState } from "@/services/portal-actions";
import {
  MAX_FILES,
  MAX_FILE_BYTES,
  ACCEPTED_MIME_TYPES,
  ACCEPT_ATTR,
} from "@/lib/portal/constants";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ServiceRequestForm() {
  const [state, action, pending] = useActionState<PortalActionState, FormData>(
    submitServiceRequest,
    undefined
  );
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  // Clear the selected files after a successful submit so a second request
  // does not silently re-send the previous attachments.
  function clearFiles() {
    setFiles([]);
    setFileError(null);
  }

  function onFilesChange(list: FileList | null) {
    setFileError(null);
    if (!list) {
      setFiles([]);
      return;
    }
    const chosen = Array.from(list);
    if (chosen.length > MAX_FILES) {
      setFileError(`You can attach up to ${MAX_FILES} files.`);
      setFiles(chosen.slice(0, MAX_FILES));
      return;
    }
    const oversized = chosen.find((f) => f.size > MAX_FILE_BYTES);
    if (oversized) {
      setFileError(`${oversized.name} exceeds the 8MB per-file limit.`);
      setFiles(chosen);
      return;
    }
    const unsupported = chosen.find((f) => !ACCEPTED_MIME_TYPES.includes(f.type));
    if (unsupported) {
      setFileError(
        `${unsupported.name} is not a supported file type (PDF, Word, images, or text only).`
      );
      setFiles(chosen);
      return;
    }
    setFiles(chosen);
  }

  return (
    <form
      action={async (formData) => {
        await action(formData);
        clearFiles();
      }}
      className="space-y-4"
    >
      {state?.ok ? (
        <div role="alert" className="alert alert-success alert-soft">
          <span>{state.message ?? "Request submitted. We'll be in touch soon."}</span>
        </div>
      ) : (
        state?.message && (
          <div role="alert" className="alert alert-error alert-soft">
            <span>{state.message}</span>
          </div>
        )
      )}

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="serviceType">What do you need help with?</label>
        <select id="serviceType" name="serviceType" required className="select w-full" defaultValue="">
          <option value="" disabled>Select a service…</option>
          <option value="Psychological Assessment">Psychological Assessment</option>
          <option value="Therapy / Counselling">Therapy / Counselling</option>
          <option value="Medico-Legal Report">Medico-Legal Report</option>
          <option value="Occupational Health">Occupational Health</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="notes">Notes (optional)</label>
        <textarea id="notes" name="notes" className="textarea w-full" placeholder="Anything that would help us prepare…" />
      </div>

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="files">
          Supporting documents (optional)
        </label>
        <input
          id="files"
          name="files"
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="file-input file-input-bordered w-full"
          onChange={(e) => onFilesChange(e.target.files)}
        />
        <p className="mt-1 text-xs text-base-content/60">
          Up to {MAX_FILES} files, {formatBytes(MAX_FILE_BYTES)} each — PDF, Word, images or
          text. Reports, referrals, or anything else that will help us understand your situation.
        </p>
        {fileError && <p className="mt-1 text-sm text-error">{fileError}</p>}
        {files.length > 0 && !fileError && (
          <ul className="mt-3 space-y-1">
            {files.map((f) => (
              <li
                key={`${f.name}-${f.size}`}
                className="flex items-center justify-between gap-2 rounded-lg bg-base-200 px-3 py-2 text-sm"
              >
                <span className="truncate font-medium">{f.name}</span>
                <span className="shrink-0 text-xs text-base-content/60">{formatBytes(f.size)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}
