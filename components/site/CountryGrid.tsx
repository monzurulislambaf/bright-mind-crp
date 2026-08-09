"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlassIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  countries,
  countryRegions,
  type CountryRegion,
} from "@/data/countries";

export function CountryGrid() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<CountryRegion>("All");
  const reduce = useReducedMotion();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return countries.filter((country) => {
      const matchesRegion = region === "All" || country.region === region;
      const matchesQuery =
        !q ||
        country.name.toLowerCase().includes(q) ||
        country.region.toLowerCase().includes(q) ||
        (country.note?.toLowerCase().includes(q) ?? false);
      return matchesRegion && matchesQuery;
    });
  }, [query, region]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="input input-bordered flex w-full items-center gap-2 sm:max-w-sm">
          <span className="sr-only">Search countries</span>
          <MagnifyingGlassIcon
            className="h-4 w-4 opacity-60"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search countries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="grow"
          />
        </label>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by region"
        >
          {countryRegions.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className={`btn btn-sm ${region === r ? "btn-primary" : "btn-ghost"}`}
              aria-pressed={region === r}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-box border border-dashed border-base-300 bg-base-200/50 p-8 text-center text-base-content/70">
          No countries match your search. Contact us to discuss availability
          outside this list.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((country) => (
              <motion.li
                key={country.name}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="surface-card"
              >
                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-field bg-secondary/10 text-secondary">
                      <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-medium text-primary">{country.name}</p>
                      {country.note ? (
                        <p className="mt-1 text-sm text-base-content/60">
                          {country.note}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <span className="badge badge-soft badge-secondary badge-sm">
                    {country.region}
                  </span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
