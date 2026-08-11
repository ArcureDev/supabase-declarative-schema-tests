import {
  readdirSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";

// The next-engine migration must not become the legacy baseline. Removing only
// generated SQL from this isolated working copy gives both engines state A.
const migrations = join(process.cwd(), "supabase", "migrations");
for (const entry of readdirSync(migrations, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".sql")) {
    throw new Error(`Unexpected migration entry: ${entry.name}`);
  }
  rmSync(join(migrations, entry.name));
}
