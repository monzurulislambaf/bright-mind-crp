"use client";

import { useState, useTransition } from "react";
import { importLeads } from "@/services/crm-actions";

const TARGETS = ["firstName", "lastName", "email", "phone", "company", "role", "source", "notes"] as const;

type Mapping = Record<string, string>;

function parseCsvRow(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      cells.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  cells.push(cur);
  return cells;
}

function parseCsvRows(text: string): string[][] {
  const lines: string[][] = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    lines.push(parseCsvRow(trimmed).map((cell) => cell.trim()));
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
      const key = h.toLowerCase().trim();
      const target = TARGETS.find((t) => t.toLowerCase() === key);
      initial[i] = target ?? "";
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