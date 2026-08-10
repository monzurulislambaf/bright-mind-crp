/**
 * One-off data repair: bring idSequences in line with existing records.
 *
 * Background: some collections were seeded with IDs before their sequence
 * entry existed, or the counter drifted behind the highest used number.
 * The next nextId() call would then collide on the unique ID index.
 *
 * Safe to re-run: it only ever moves counters UP to (max existing + 1),
 * and creates missing entries for empty-but-known collections.
 *
 * Usage: node scripts/repair-id-sequences.cjs
 */
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

// key -> { collection, field, prefix, yearBased }
const TARGETS = {
  USR: { collection: "users", field: "userId", prefix: "BM-USR-", yearBased: false },
  CASE: { collection: "cases", field: "caseId", prefix: "BM-CASE-", yearBased: true },
  LEAD: { collection: "leads", field: "leadId", prefix: "BM-LEAD-", yearBased: false },
  QL: { collection: "qualifiedleads", field: "qualifiedId", prefix: "BM-QL-", yearBased: true },
  CON: { collection: "formsubmissions", field: "formId", prefix: "BM-CON-", yearBased: false },
  ORG: { collection: "organisations", field: "orgId", prefix: "BM-ORG-", yearBased: false },
  SOL: { collection: "solicitors", field: "solicitorId", prefix: "BM-SOL-", yearBased: false },
  PSY: { collection: "psychologists", field: "psychologistId", prefix: "BM-PSY-", yearBased: false },
  CLI: { collection: "individualclients", field: "clientId", prefix: "BM-CLI-", yearBased: false },
  DOC: { collection: "documents", field: "documentId", prefix: "BM-DOC-", yearBased: false },
  APT: { collection: "appointments", field: "appointmentId", prefix: "BM-APT-", yearBased: true },
  TSK: { collection: "tasks", field: "taskId", prefix: "BM-TSK-", yearBased: true },
  TKT: { collection: "tickets", field: "ticketId", prefix: "BM-TKT-", yearBased: true },
  RPT: { collection: "reports", field: "reportId", prefix: "BM-RPT-", yearBased: true },
  AUD: { collection: "auditlogs", field: "auditId", prefix: "BM-AUD-", yearBased: false },
};

function maxNumber(id, prefix) {
  if (typeof id !== "string" || !id.startsWith(prefix)) return 0;
  // BM-CASE-2026-000001 or BM-USR-000001 — take the trailing numeric segment.
  const match = id.slice(prefix.length).match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

async function main() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  const db = mongoose.connection.db;

  for (const [key, t] of Object.entries(TARGETS)) {
    let max = 0;
    try {
      const docs = await db
        .collection(t.collection)
        .find({ [t.field]: { $exists: true } }, { projection: { [t.field]: 1 } })
        .toArray();
      for (const d of docs) {
        const n = maxNumber(d[t.field], t.prefix);
        if (n > max) max = n;
      }
    } catch (e) {
      console.warn(`  ! could not scan ${t.collection}: ${e.message}`);
    }

    const year = t.yearBased ? new Date().getFullYear() : undefined;
    const keyName = t.yearBased ? `${key}-${year}` : key;

    // Existing entry? bump it only if behind. Missing entry? create it at max.
    const doc = await db.collection("idsequences").findOne({ key: keyName });
    const current = doc?.currentNumber ?? 0;
    const target = Math.max(current, max);
    const now = new Date();

    if (!doc) {
      await db.collection("idsequences").insertOne({
        key: keyName,
        currentNumber: target,
        prefix: t.prefix.slice(0, -1),
        yearBased: t.yearBased,
        year,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`created  ${keyName}  counter=${target}  (max seen: ${max})`);
    } else if (target > current) {
      await db
        .collection("idsequences")
        .updateOne({ key: keyName }, { $set: { currentNumber: target, updatedAt: now } });
      console.log(`bumped   ${keyName}  ${current} -> ${target}  (max seen: ${max})`);
    } else {
      console.log(`ok       ${keyName}  counter=${current}  (max seen: ${max})`);
    }
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
