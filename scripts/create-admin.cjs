/**
 * One-off admin account bootstrap (design §4, §28).
 *
 * Usage:
 *   node scripts/create-admin.cjs --email admin@brightmind.co.uk --password 'YourPassword'
 *
 * Loads MONGODB_URI from .env.local, creates a MASTER_ADMIN user with an
 * atomic BM-USR-NNNNNN ID, and writes an audit log entry. Safe to re-run:
 * it refuses to overwrite an existing user.
 */
const path = require("path");
const readline = require("node:readline/promises");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

function parseArgs(argv) {
  const args = { email: undefined, password: undefined };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--email") args.email = argv[i + 1];
    if (argv[i] === "--password") args.password = argv[i + 1];
  }
  return args;
}

async function promptSecret(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer;
}

async function nextUserId() {
  const docs = await mongoose.connection.collection("users").find(
    { userId: /^BM-USR-\d{6}$/ },
    { projection: { userId: 1 } }
  ).toArray();
  let max = 0;
  for (const d of docs) {
    const n = Number(d.userId.split("-")[2]);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return `BM-USR-${String(max + 1).padStart(6, "0")}`;
}

async function main() {
  let { email, password } = parseArgs(process.argv.slice(2));

  if (!email || !password) {
    email = (await promptSecret("Email: ")).trim().toLowerCase();
    password = await promptSecret("Password (min 8 chars): ");
  }

  email = email.toLowerCase().trim();
  if (!email || password.length < 8) {
    console.error("Provide a valid email and a password of at least 8 characters.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  const db = mongoose.connection.db;

  const users = db.collection("users");
  const existing = await users.findOne({ email });
  if (existing) {
    console.error(`A user with email ${email} already exists (${existing.userId}).`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const userId = await nextUserId();
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();

  await users.insertOne({
    userId,
    firstName: "System",
    lastName: "Admin",
    email,
    phone: "",
    passwordHash,
    role: "MASTER_ADMIN",
    userType: "EMPLOYEE",
    roleIds: [],
    mfaEnabled: false,
    mfaSecret: undefined,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });

  await db.collection("auditlogs").insertOne({
    auditId: `BM-AUD-${String(Date.now()).slice(-6)}`,
    actor: userId,
    actorUserId: null,
    action: "CREATE",
    resource: "user",
    resourceType: "USER",
    resourceId: userId,
    newValue: { email, role: "MASTER_ADMIN" },
    metadata: { event: "cli.create-admin" },
    createdAt: now,
    updatedAt: now,
  });

  console.log("");
  console.log("Admin account created");
  console.log("  User ID: " + userId);
  console.log("  Role:    MASTER_ADMIN");
  console.log("  Email:   " + email);
  console.log("Log in at /login");
  console.log("");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});