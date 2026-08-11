import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const fixtureDirectory = dirname(fileURLToPath(import.meta.url));
const cliEntry = resolve(
  fixtureDirectory,
  "../../../../node_modules/supabase/dist/supabase.js",
);
const child = spawn(
  process.execPath,
  [
    cliEntry,
    "db",
    "schema",
    "declarative",
    "sync",
    "--apply",
    "--debug",
  ],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      SUPABASE_USE_PG_DELTA_NEXT: "true",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let output = "";
child.stdout.on("data", (chunk: Buffer) => {
  output += chunk.toString("utf8");
});
child.stderr.on("data", (chunk: Buffer) => {
  output += chunk.toString("utf8");
});

// The fixture's event trigger holds ALTER TABLE for 20 seconds. Five seconds
// allows normal startup and migration generation before terminating the CLI.
const interrupted = setTimeout(() => child.kill(), 5_000);
const result = await new Promise<{ code: number | null; signal: NodeJS.Signals | null }>(
  (resolveExit, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolveExit({ code, signal }));
  },
);
clearTimeout(interrupted);

if (result.code === 0) {
  throw new Error(`Supabase sync completed before it could be interrupted.\n${output}`);
}
process.stdout.write(`${output}\nINTERRUPTED_SUPABASE_COMMAND\n`);
