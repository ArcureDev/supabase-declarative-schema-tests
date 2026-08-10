import { cpSync, existsSync, mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { runCommandTask, runSupabase } from "./commands.mts";
import { discoverCases, requirePathInside } from "./files.mts";
import { createReportPath, writeReport } from "./reporting.mts";
import {
  caseNumberFromName,
  failedCaseNumbersFromReport,
  latestReportPath,
  parseCaseSelection,
} from "./selection.mts";
import { runSnapshotCase } from "./snapshot-case.mts";
import { projectFailed } from "./status.mts";
import { runRenameAmbiguityTransition } from "./transition-case.mts";
import type { CommandResult, ProjectResult, RunnerConfig, TestCase } from "./types.mts";
import { updateVersionReportsFromReports } from "./versions.mts";

function selectCases(config: RunnerConfig, args: string[], availableCases: TestCase[]): TestCase[] {
  const casesByNumber = new Map<number, TestCase>();
  for (const availableCase of availableCases) {
    const caseNumber = caseNumberFromName(availableCase.name);
    if (caseNumber === undefined) {
      throw new Error(`Case name must start with a number: ${availableCase.name}.`);
    }
    const existingCase = casesByNumber.get(caseNumber);
    if (existingCase) {
      throw new Error(
        `Cases ${existingCase.name} and ${availableCase.name} use the same number ${caseNumber}.`,
      );
    }
    casesByNumber.set(caseNumber, availableCase);
  }

  const selection = parseCaseSelection(args);
  let selectedCaseNumbers: Set<number> | undefined;
  if (selection.kind === "numbers") {
    selectedCaseNumbers = selection.caseNumbers;
  } else if (selection.kind === "latest-failures") {
    const previousReportPath = latestReportPath(config.reportsDirectory);
    selectedCaseNumbers = failedCaseNumbersFromReport(previousReportPath);
    process.stdout.write(`Selecting failed cases from ${previousReportPath}\n`);
    if (selectedCaseNumbers.size === 0) {
      throw new Error(`The latest report has no failed cases: ${previousReportPath}`);
    }
  }

  const selectedCases = selectedCaseNumbers
    ? availableCases.filter((availableCase) => {
        const caseNumber = caseNumberFromName(availableCase.name);
        return caseNumber !== undefined && selectedCaseNumbers.has(caseNumber);
      })
    : availableCases;
  if (selectedCases.length === 0) {
    const availableCaseNumbers = availableCases
      .map((availableCase) => /^\d+/.exec(availableCase.name)?.[0])
      .filter((caseNumber) => caseNumber !== undefined)
      .join(", ");
    throw new Error(`None of the selected cases exist. Available cases: ${availableCaseNumbers}.`);
  }
  if (selectedCaseNumbers) {
    const missingCaseNumbers = [...selectedCaseNumbers].filter(
      (caseNumber) => !casesByNumber.has(caseNumber),
    );
    if (missingCaseNumbers.length > 0) {
      throw new Error(`Selected case(s) do not exist: ${missingCaseNumbers.join(", ")}.`);
    }
  }
  return selectedCases;
}

export async function runDeclarativeSchema(
  config: RunnerConfig,
  args: string[],
): Promise<number> {
  if (!existsSync(config.runtimeTemplateDirectory)) {
    throw new Error(`Runtime template does not exist: ${config.runtimeTemplateDirectory}`);
  }
  mkdirSync(config.reportsDirectory, { recursive: true });
  const reportPath = createReportPath(config.reportsDirectory);
  const availableCases = discoverCases(config);
  if (availableCases.length === 0) {
    throw new Error("Expected at least one schema case.");
  }
  const selectedCases = selectCases(config, args, availableCases);

  mkdirSync(config.localWorkRoot, { recursive: true });
  const runDirectory = mkdtempSync(join(config.localWorkRoot, "run-"));
  const controlProject = join(runDirectory, "shared-runtime-control");
  requirePathInside(runDirectory, controlProject);
  cpSync(config.runtimeTemplateDirectory, controlProject, {
    recursive: true,
    errorOnExist: true,
  });
  const results: ProjectResult[] = [];

  process.stdout.write("Preparing test runtime\n");
  const startupCleanup = await runCommandTask(
    config,
    "Stop any leftover local Supabase runtime",
    () => runSupabase(config, controlProject, ["supabase", "stop", "--no-backup"]),
  );
  if (startupCleanup.status !== "OK") {
    throw new Error(`Unable to clean the shared runtime:\n${startupCleanup.output}`);
  }

  let finalCleanup: CommandResult | undefined;
  try {
    for (const [caseIndex, testCase] of selectedCases.entries()) {
      process.stdout.write(`\nCase ${testCase.name}\n`);
      const context = { config, runDirectory, caseIndex };
      const result =
        testCase.kind === "rename-ambiguity-transition"
          ? await runRenameAmbiguityTransition(testCase, context)
          : await runSnapshotCase(testCase, context);
      results.push(result);
      writeReport(config, reportPath, results, runDirectory);
    }
  } finally {
    process.stdout.write("\nCleaning up test runtime\n");
    finalCleanup = await runCommandTask(config, "Stop local Supabase", () =>
      runSupabase(config, controlProject, ["supabase", "stop", "--no-backup"]),
    );
    writeReport(
      config,
      reportPath,
      results,
      runDirectory,
      finalCleanup.status === "ERROR" ? finalCleanup : undefined,
    );
    updateVersionReportsFromReports(config);
    process.stdout.write(`Version report updated in ${config.versionsDirectory}\n`);
  }

  if (!finalCleanup) {
    throw new Error("Shared runtime cleanup did not run.");
  }
  const failed = results.some(projectFailed) || finalCleanup.status !== "OK";
  process.stdout.write(`Report written to ${reportPath}\n`);
  return failed ? 1 : 0;
}
