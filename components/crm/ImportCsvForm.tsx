"use client";

import { useState, useTransition } from "react";
import { importLeads } from "@/services/crm-actions";

const TARGETS = ["firstName", "lastName", "email", "phone", "company", "role", "source", "notes"] as const;

type Mapping = Record<string, string>;

function parseCsvRows(text: string): string[][] {
  const lines: string[][] = [];
  const re = /("(?:[^"]|"")*"|[^,\n\r]*)/g;
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const matches = trimmed.match(re) || [];
    const row = matches
      .map((m) => (m.startsWith('"') && m.endsWith('"') ? m.slice(1, -1).replace(/""/g, '"') : m.trim()));
    lines.push(row);
  }
  return lines;
}

export function ImportCsvForm() {
  const [csv, setCsv] = useState("");
  const [headerRow, setHeaderRow] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Mapping>({});
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  function load() {
    const parsed = parseCsvRows(csv);
    if (parsed.length === 0) return;
    setHeaderRow(parsed[0]);
    setRows(parsed.slice(1));
    const initial: Mapping = {};
    parsed[0].forEach((h, i) => {
      initial[i] = h.toLowerCase() in TARGETS ? h.toLowerCase() : "";
    });
    setMapping(initial);
    setResult(null);
  }

  function submit() {
    const mapped = rows.map((row) => {
      const obj: Record<string, string> = {};
      headerRow.forEach((_, i) => {
        const target = mapping[i];
        if (target) obj[target] = row[i] ?? "";
      });
      return obj;
    });
    startTransition(async () => {
      const res = await importLeads(mapped);
      setResult(res?.message ?? "");
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="label pb-1 text-sm font-medium">Paste CSV</label>
        <textarea
          className="textarea w-full font-mono text-xs"
          rows={10}
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder="firstName,lastName,email,phone,company&#10;Jane,Doe,jane@example.com,02000000000,ABC Law"
        />
        <button className="btn btn-ghost mt-2" onClick={load} disabled={!csv.trim()}>
          Parse preview
        </button>
      </div>

      {headerRow.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold">Column mapping</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {headerRow.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-base-content/70">{h}</span>
                <select
                  className="select select-sm grow bg-base-100"
                  value={mapping[i] ?? ""}
                  onChange={(e) => setMapping((m) => ({ ...m, [i]: e.target.value }))}
                >
                  <option value="">Ignore</option>
                  {TARGETS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-base-content/60">
            {rows.length} data row(s) detected.
          </p>
          <button className="btn btn-primary mt-4" disabled={pending || rows.length === 0} onClick={submit}>
            {pending ? "Importing…" : `Import ${rows.length} leads`}
          </button>
        </div>
      )}

      {result && (
        <div role="alert" className="alert alert-soft alert-success sm:alert-horizontal">
          <span>{result}</span>
        </div>
      )}
    </div>
  );
}