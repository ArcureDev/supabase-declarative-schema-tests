import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadRunnerConfig } from "./runner/config.mts";
import { runDeclarativeSchema } from "./runner/runner.mts";

import { updateVersionReportsFromReports as updateVersions } from "./runner/versions.mts";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));

export const helpText = `Usage: npm run declarative-schema -- [options]

Run the Supabase declarative schema test suite.

Options:
  --case=<selection>  Run case numbers, ranges, or comma-separated selections
                      (examples: --case=18, --case=10-20, --case=10-15,24)
  --failed            Rerun failed or warning cases from the latest report
  --not-ok            Run cases not fully OK in the current version matrix
  --verbose           Print each Supabase CLI command as it runs
  --help              Show this help message
`;

export function updateVersionReportsFromReports(): void {
  updateVersions(loadRunnerConfig(scriptDirectory, process.argv.slice(2)));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    process.stdout.write(helpText);
  } else {
    process.exitCode = await runDeclarativeSchema(
      loadRunnerConfig(scriptDirectory, args),
      args,
    );
  }
}

export {
  failedCaseNumbersFromReport,
  parseCaseSelection,
} from "./runner/selection.mts";