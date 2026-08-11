import { cpSync, existsSync, mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { runCommandTask, runSupabase } from "./commands.mts";
import { runCoverageCase } from "./coverage-case.mts";
import { discoverCases, requirePathInside } from "./files.mts";
import { createReportPath, writeReport } from "./reporting.mts";
import {
  caseNumberFromName,
  failedCaseNumbersFromReport,
  latestReportPath,
  latestVersionPath,
  notDoneCaseNumbersFromVersion,
  notOkCaseNumbersFromVersion,
  parseCaseSelection,
} from "./selection.mts";
import { runSnapshotCase } from "./snapshot-case.mts";
import { projectFailed } from "./status.mts";
import {
  runApplicableTransition,
  runDeterministicOutputTransition,
  runExpectedUnsupportedTransition,
  runNoOpConvergenceTransition,
  runPlanningSafetyTransition,
  runRecoveryAfterFailureTransition,
} from "./transition-case.mts";
import type {
  CaseRunContext,
  CommandResult,
  ProjectResult,
  RunnerConfig,
  TestCase,
  TransitionCase,
} from "./types.mts";
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
  } else if (selection.kind === "latest-not-ok") {
    const versionPath = latestVersionPath(
      config.versionsDirectory,
      config.supabaseChecksum,
      "--not-ok",
    );
    selectedCaseNumbers = notOkCaseNumbersFromVersion(
      versionPath,
      config.supabaseCliVersion,
      config.supabaseChecksum,
      availableCases.map((availableCase) => availableCase.name),
    );
    process.stdout.write(`Selecting not-OK cases from ${versionPath}\n`);
    if (selectedCaseNumbers.size === 0) {
      throw new Error(`The current version report has no not-OK cases: ${versionPath}`);
    }
  } else if (selection.kind === "latest-not-done") {
    const versionPath = latestVersionPath(
      config.versionsDirectory,
      config.supabaseChecksum,
      "--not-done",
    );
    selectedCaseNumbers = notDoneCaseNumbersFromVersion(
      versionPath,
      config.supabaseCliVersion,
      config.supabaseChecksum,
      availableCases.map((availableCase) => availableCase.name),
    );
    process.stdout.write(`Selecting not-done cases from ${versionPath}\n`);
    if (selectedCaseNumbers.size === 0) {
      throw new Error(`The current version report has no not-done cases: ${versionPath}`);
    }
  }

  const selectedCases = selectedCaseNumbers
    ? availableCases.filter((availableCase) => {
        const caseNumber = caseNumberFromName(availableCase.name);
        return caseNumber !== undefined && selectedCaseNumbers.has(caseNumber);
      })
    : availableCases;
  if (
    (selection.kind === "latest-not-ok" || selection.kind === "latest-not-done") &&
    selectedCaseNumbers
  ) {
    const selectionOrder = new Map(
      [...selectedCaseNumbers].map((caseNumber, index) => [caseNumber, index]),
    );
    selectedCases.sort((left, right) => {
      const leftCaseNumber = caseNumberFromName(left.name);
      const rightCaseNumber = caseNumberFromName(right.name);
      return (
        (leftCaseNumber === undefined ? 0 : (selectionOrder.get(leftCaseNumber) ?? 0)) -
        (rightCaseNumber === undefined ? 0 : (selectionOrder.get(rightCaseNumber) ?? 0))
      );
    });
  }
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

async function runTransitionCase(
  testCase: TransitionCase,
  context: CaseRunContext,
): Promise<ProjectResult> {
  return testCase.kind === "rename-ambiguity-transition" ||
    testCase.kind === "destructive-change-transition"
    ? runPlanningSafetyTransition(testCase, context)
    : testCase.kind === "expected-unsupported-transition"
      ? runExpectedUnsupportedTransition(testCase, context)
      : testCase.kind === "populated-column-transition" ||
          testCase.kind === "dependency-ordering-transition" ||
          testCase.kind === "grants-rls-preservation-transition" ||
          testCase.kind === "applicable-transition"
        ? runApplicableTransition(testCase, context)
        : testCase.kind === "no-op-convergence-transition"
          ? runNoOpConvergenceTransition(testCase, context)
          : testCase.kind === "deterministic-output-transition"
            ? runDeterministicOutputTransition(testCase, context)
            : runRecoveryAfterFailureTransition(testCase, context);
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
  const planeArgument = args.find((argument) => argument.startsWith("--plane="));
  const requestedPlane = planeArgument?.slice("--plane=".length);
  const validPlanes = new Set(["ddl", "service", "functions", "config", "remote"]);
  if (requestedPlane && !validPlanes.has(requestedPlane)) {
    throw new Error(`Invalid coverage plane: ${requestedPlane}.`);
  }
  // Remote cases are deliberately invisible unless the caller opts in; a
  // normal all-cases run must never mutate a linked project by accident.
  let selectableCases = args.includes("--remote")
    ? availableCases
    : availableCases.filter(
        (testCase) => testCase.kind !== "coverage" || !testCase.remote,
      );
  if (requestedPlane) {
    selectableCases = selectableCases.filter((testCase) =>
      requestedPlane === "ddl"
        ? testCase.kind !== "coverage"
        : testCase.kind === "coverage" && testCase.plane === requestedPlane
    );
  }
  const selectedCases = selectCases(config, args, selectableCases);

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
      const context: CaseRunContext = {
        config,
        runDirectory,
        caseIndex,
        pgDeltaEngine: "next",
      };
      let result: ProjectResult;
      if (testCase.kind === "snapshot") {
        result = await runSnapshotCase(testCase, context);
      } else if (testCase.kind === "coverage") {
        result = await runCoverageCase(testCase, context);
      } else {
        result = await runTransitionCase(testCase, context);
        if (projectFailed(result)) {
          process.stdout.write(`\nRetrying case ${testCase.name} with pg-delta legacy\n`);
          result.legacyTransition = await runTransitionCase(testCase, {
            ...context,
            pgDeltaEngine: "legacy",
          });
        }
      }
      results.push(result);
      writeReport(config, reportPath, results, runDirectory);
      // Refresh the checksum matrix after every evaluated case so migrations,
      // transitions, and coverage all land in versions/ as soon as they report.
      updateVersionReportsFromReports(config);
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
