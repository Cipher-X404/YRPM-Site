#!/usr/bin/env node
// Generates scrypt credentials for the admin login.
// Usage: npm run admin:hash -- "your long passphrase"
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv.slice(2).join(" ").trim();

if (!password) {
  console.error('Usage: npm run admin:hash -- "your long passphrase"');
  process.exit(1);
}
if (password.length < 12) {
  console.warn(
    "Warning: use at least 12 characters. This is the only key to the studio.",
  );
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log("\nAdd these to .env.local (or your host's environment):\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`ADMIN_PASSWORD_SALT=${salt}`);
console.log("\nGenerate a session secret with:  openssl rand -hex 32\n");
