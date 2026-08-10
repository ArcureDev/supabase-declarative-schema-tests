import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadRunnerConfig } from "./runner/config.mts";
import { runDeclarativeSchema } from "./runner/runner.mts";

import { updateVersionReportsFromReports as updateVersions } from "./runner/versions.mts";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));

export function updateVersionReportsFromReports(): void {
  updateVersions(loadRunnerConfig(scriptDirectory, process.argv.slice(2)));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  process.exitCode = await runDeclarativeSchema(
    loadRunnerConfig(scriptDirectory, args),
    args,
  );
}

export {
  failedCaseNumbersFromReport,
  parseCaseSelection,
} from "./runner/selection.mts";