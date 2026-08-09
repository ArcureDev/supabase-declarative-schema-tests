import { spawnSync } from "node:child_process";
import {
  cpSync,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryDirectory = resolve(scriptDirectory, "..");
const repositoryPackagePath = join(repositoryDirectory, "package.json");
const supabaseCliPackagePath = join(
  repositoryDirectory,
  "node_modules",
  "supabase",
  "package.json",
);
const supabaseCliEntry = join(
  repositoryDirectory,
  "node_modules",
  "supabase",
  "dist",
  "supabase.js",
);
const supabaseCliPackage = JSON.parse(readFileSync(supabaseCliPackagePath, "utf8")) as {
  version?: unknown;
};
if (typeof supabaseCliPackage.version !== "string" || supabaseCliPackage.version.length === 0) {
  throw new Error(`Unable to determine the Supabase CLI version from ${supabaseCliPackagePath}.`);
}
const supabaseCliVersion = supabaseCliPackage.version;
const repositoryPackage = JSON.parse(readFileSync(repositoryPackagePath, "utf8")) as {
  dependencies?: Record<string, unknown>;
  devDependencies?: Record<string, unknown>;
};
const supabaseDependency =
  repositoryPackage.dependencies?.["supabase"] ?? repositoryPackage.devDependencies?.["supabase"];
const supabaseChecksumMatch =
  typeof supabaseDependency === "string" ? /@([0-9a-f]{7,40})$/i.exec(supabaseDependency) : null;
if (!supabaseChecksumMatch) {
  throw new Error(
    `Unable to determine the Supabase checksum from the pinned dependency in ${repositoryPackagePath}.`,
  );
}
const supabaseChecksum = supabaseChecksumMatch[1].slice(0, 7);
const migrationsDirectory = join(scriptDirectory, "migrations");
const runtimeTemplateDirectory = join(scriptDirectory, "runtime");
const localWorkRoot = join(scriptDirectory, ".tmp");
const reportsDirectory = join(scriptDirectory, "reports");
const versionsDirectory = join(scriptDirectory, "versions");
const commandTimeoutMilliseconds = 10 * 60 * 1000;
const scriptArguments = process.argv.slice(2);
const verbose = scriptArguments.includes("--verbose");

type CaseSelection =
  | { kind: "all" }
  | { kind: "numbers"; caseNumbers: Set<number> }
  | { kind: "latest-failures" };

export function parseCaseSelection(args: string[]): CaseSelection {
  if (args.includes("--case")) {
    throw new Error("Missing case selection. Use --case=X, --case=X-Y, or --case=X,Y,Z.");
  }

  const caseArguments = args.filter((argument) => argument.startsWith("--case="));
  if (caseArguments.length > 1) {
    throw new Error("Specify --case only once.");
  }
  const failedArguments = args.filter(
    (argument) => argument === "--failed" || argument.startsWith("--failed="),
  );
  if (failedArguments.some((argument) => argument !== "--failed")) {
    throw new Error("The --failed option does not accept a value.");
  }
  if (failedArguments.length > 1) {
    throw new Error("Specify --failed only once.");
  }
  if (caseArguments.length > 0 && failedArguments.length > 0) {
    throw new Error("Use either --case or --failed, not both.");
  }
  if (failedArguments.length === 1) {
    return { kind: "latest-failures" };
  }
  if (caseArguments.length === 0) {
    return { kind: "all" };
  }

  const value = caseArguments[0].slice("--case=".length);
  const caseNumbers = new Set<number>();
  for (const part of value.split(",")) {
    const singleCaseMatch = /^(\d+)$/.exec(part);
    if (singleCaseMatch) {
      const caseNumber = Number(singleCaseMatch[1]);
      if (caseNumber < 1) {
        throw new Error(`Invalid case selection "${value}". Case numbers must be positive.`);
      }
      caseNumbers.add(caseNumber);
      continue;
    }

    const rangeMatch = /^(\d+)-(\d+)$/.exec(part);
    if (!rangeMatch) {
      throw new Error(
        `Invalid case selection "${value}". Use --case=18, --case=10-20, or --case=11,15,24.`,
      );
    }
    const firstCaseNumber = Number(rangeMatch[1]);
    const lastCaseNumber = Number(rangeMatch[2]);
    if (firstCaseNumber < 1 || lastCaseNumber < firstCaseNumber) {
      throw new Error(
        `Invalid case range "${part}". Ranges must contain positive numbers in ascending order.`,
      );
    }
    if (lastCaseNumber - firstCaseNumber > 10_000) {
      throw new Error(`Invalid case range "${part}". A range cannot contain over 10,001 cases.`);
    }
    for (let caseNumber = firstCaseNumber; caseNumber <= lastCaseNumber; caseNumber += 1) {
      caseNumbers.add(caseNumber);
    }
  }

  return { kind: "numbers", caseNumbers };
}

const caseSelection = parseCaseSelection(scriptArguments);

function caseNumberFromName(caseName: string): number | undefined {
  const caseNumber = /^\d+/.exec(caseName)?.[0];
  return caseNumber === undefined ? undefined : Number(caseNumber);
}

function latestReportPath(): string {
  if (!existsSync(reportsDirectory)) {
    throw new Error("Cannot use --failed because no previous report exists.");
  }
  const reportFileName = readdirSync(reportsDirectory)
    .filter((fileName) => /^report-.*\.md$/.test(fileName))
    .sort((left, right) => right.localeCompare(left))[0];
  if (!reportFileName) {
    throw new Error("Cannot use --failed because no previous report exists.");
  }
  return join(reportsDirectory, reportFileName);
}

export function failedCaseNumbersFromReport(reportFilePath: string): Set<number> {
  const report = readFileSync(reportFilePath, "utf8");
  const failedCaseNumbers = new Set<number>();
  const resultMarkerPattern =
    /<!-- declarative-schema-case-result name="([^"]+)" status="(OK|WARNING|FAILED)" -->/g;
  const resultMarkers = [...report.matchAll(resultMarkerPattern)];

  if (resultMarkers.length > 0) {
    for (const marker of resultMarkers) {
      if (marker[2] !== "OK") {
        const caseNumber = caseNumberFromName(marker[1]);
        if (caseNumber !== undefined) failedCaseNumbers.add(caseNumber);
      }
    }
    return failedCaseNumbers;
  }

  // Reports written before per-case result markers were introduced are still supported.
  const caseSections = [...report.matchAll(/^## (.+)\r?\n([\s\S]*?)(?=^## |(?![\s\S]))/gm)];
  for (const section of caseSections) {
    const caseNumber = caseNumberFromName(section[1]);
    if (
      caseNumber !== undefined &&
      /- Result: \*\*(?:WARNING|ERROR|SKIPPED)\*\*/.test(section[2])
    ) {
      failedCaseNumbers.add(caseNumber);
    }
  }
  return failedCaseNumbers;
}

function createReportPath(now = new Date()): string {
  const timestamp = now.toISOString().replaceAll(":", "-").replaceAll(".", "-");
  const baseName = `report-${timestamp}`;
  let reportPath = join(reportsDirectory, `${baseName}.md`);
  let collisionIndex = 2;

  while (existsSync(reportPath)) {
    reportPath = join(reportsDirectory, `${baseName}-${collisionIndex}.md`);
    collisionIndex += 1;
  }

  return reportPath;
}

const reportPath = createReportPath();

type CommandResult = {
  command: string;
  durationMilliseconds: number;
  exitCode: number | null;
  output: string;
  status: "OK" | "WARNING" | "ERROR" | "SKIPPED";
};

type PgDeltaEngine = "next" | "legacy";

type GeneratedFile = {
  path: string;
  content: string;
};

type ProjectResult = {
  name: string;
  migrationSql: string;
  reset?: CommandResult;
  generate: CommandResult;
  nextGeneratedFiles?: GeneratedFile[];
  legacyGenerate?: CommandResult;
  legacyGeneratedFiles?: GeneratedFile[];
  sync: CommandResult;
  syncVerification?: CommandResult;
  legacySync?: CommandResult;
  legacySyncVerification?: CommandResult;
};

type ProjectStatus = "OK" | "WARNING" | "FAILED";
type LegacyProjectStatus = ProjectStatus | "NOT RUN";

function commandResultsStatus(commandResults: CommandResult[]): ProjectStatus {
  if (
    commandResults.some(
      (commandResult) => commandResult.status === "ERROR" || commandResult.status === "SKIPPED",
    )
  ) {
    return "FAILED";
  }
  return commandResults.some((commandResult) => commandResult.status === "WARNING")
    ? "WARNING"
    : "OK";
}

function projectStatus(result: ProjectResult): ProjectStatus {
  return commandResultsStatus(
    [result.reset, result.generate, result.sync, result.syncVerification].filter(
      (commandResult) => commandResult !== undefined,
    ),
  );
}

function legacyProjectStatus(result: ProjectResult): LegacyProjectStatus {
  const legacyCommandResults = [
    result.legacyGenerate,
    result.legacySync,
    result.legacySyncVerification,
  ].filter((commandResult) => commandResult !== undefined);
  return legacyCommandResults.length === 0 ? "NOT RUN" : commandResultsStatus(legacyCommandResults);
}

function projectFailed(result: ProjectResult): boolean {
  return projectStatus(result) !== "OK";
}

function requirePathInside(parent: string, candidate: string): void {
  const relativePath = relative(resolve(parent), resolve(candidate));
  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  ) {
    throw new Error(`Refusing filesystem operation outside ${parent}: ${candidate}`);
  }
}

function removeMigrationSqlFiles(workProject: string): number {
  const migrationsDirectory = join(workProject, "supabase", "migrations");
  requirePathInside(workProject, migrationsDirectory);

  if (!existsSync(migrationsDirectory)) {
    throw new Error(`Generated project has no migrations directory: ${migrationsDirectory}`);
  }

  const directoryMetadata = lstatSync(migrationsDirectory);
  if (!directoryMetadata.isDirectory() || directoryMetadata.isSymbolicLink()) {
    throw new Error(`Unsafe migrations path: ${migrationsDirectory}`);
  }

  const entries = readdirSync(migrationsDirectory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(migrationsDirectory, entry.name);
    requirePathInside(migrationsDirectory, entryPath);
    if (entry.isSymbolicLink() || !entry.isFile() || !entry.name.endsWith(".sql")) {
      throw new Error(`Unexpected entry in migrations directory: ${entryPath}`);
    }
    rmSync(entryPath);
  }

  return entries.length;
}

function inspectDirectoryTree(directory: string): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Refusing to inspect a symbolic link: ${entryPath}`);
    }
    if (entry.isDirectory()) {
      inspectDirectoryTree(entryPath);
    } else if (!entry.isFile()) {
      throw new Error(`Unexpected generated schema entry: ${entryPath}`);
    }
  }
}

function generatedSchemaDirectory(workProject: string): string {
  const directory = join(workProject, "supabase", "database");
  requirePathInside(workProject, directory);
  return directory;
}

function captureGeneratedFiles(workProject: string): GeneratedFile[] {
  const rootDirectory = generatedSchemaDirectory(workProject);
  if (!existsSync(rootDirectory)) {
    return [];
  }

  const rootMetadata = lstatSync(rootDirectory);
  if (!rootMetadata.isDirectory() || rootMetadata.isSymbolicLink()) {
    throw new Error(`Unsafe generated schema path: ${rootDirectory}`);
  }
  inspectDirectoryTree(rootDirectory);

  const files: GeneratedFile[] = [];
  function collectFiles(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const entryPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        collectFiles(entryPath);
      } else {
        files.push({
          path: relative(rootDirectory, entryPath).split(sep).join("/"),
          content: readFileSync(entryPath, "utf8").trim(),
        });
      }
    }
  }
  collectFiles(rootDirectory);
  return files.sort((left, right) => left.path.localeCompare(right.path));
}

function removeGeneratedSchema(workProject: string): void {
  const directory = generatedSchemaDirectory(workProject);
  if (!existsSync(directory)) {
    return;
  }

  const metadata = lstatSync(directory);
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    throw new Error(`Unsafe generated schema path: ${directory}`);
  }
  inspectDirectoryTree(directory);
  rmSync(directory, { recursive: true });
}

function normalizedOutput(stdout: string | Buffer | null, stderr: string | Buffer | null): string {
  const ansiEscapePattern = new RegExp(`${String.fromCharCode(27)}\\[[0-?]*[ -/]*[@-~]`, "g");
  return `${stdout ?? ""}${stderr ?? ""}`
    .replace(ansiEscapePattern, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function runSupabase(
  workProject: string,
  args: string[],
  pgDeltaEngine: PgDeltaEngine = "next",
): CommandResult {
  const command = `npx ${args.join(" ")}`;
  if (verbose) {
    const useNext = pgDeltaEngine === "next";
    process.stdout.write(`    env: SUPABASE_USE_PG_DELTA_NEXT=${useNext}\n`);
    process.stdout.write(`    command: ${command}\n`);
  }
  const cliArguments = args[0] === "supabase" ? args.slice(1) : args;
  const startedAt = performance.now();
  const result = spawnSync(process.execPath, [supabaseCliEntry, ...cliArguments], {
    cwd: workProject,
    encoding: "utf8",
    env: {
      ...process.env,
      SUPABASE_USE_PG_DELTA_NEXT: pgDeltaEngine === "next" ? "true" : "false",
    },
    timeout: commandTimeoutMilliseconds,
  });
  const durationMilliseconds = performance.now() - startedAt;
  const commandOutput = normalizedOutput(result.stdout, result.stderr);

  if (result.error) {
    const errorOutput = [commandOutput, result.error.message].filter(Boolean).join("\n");
    return {
      command,
      durationMilliseconds,
      exitCode: result.status,
      output: errorOutput,
      status: "ERROR",
    };
  }

  const hasUnmodeledKind = /\bcode=unmodeled_kind\b/.test(commandOutput);
  const output = hasUnmodeledKind
    ? [
        "Warning: the CLI exited successfully but reported an unmodeled object kind; the exported declarative schema is incomplete.",
        commandOutput,
      ].join("\n")
    : commandOutput;
  const status = result.status !== 0 ? "ERROR" : hasUnmodeledKind ? "WARNING" : "OK";
  return {
    command,
    durationMilliseconds,
    exitCode: result.status,
    output,
    status,
  };
}

function requiresFallback(result: CommandResult): boolean {
  return result.status === "WARNING" || result.status === "ERROR";
}

function requireNoSchemaChanges(result: CommandResult): CommandResult {
  if (result.status !== "ERROR" && !result.output.includes("No schema changes found")) {
    result.output = ['Expected sync output to contain "No schema changes found".', result.output]
      .filter(Boolean)
      .join("\n");
    result.status = "ERROR";
  }
  return result;
}

function skippedCommand(command: string, reason: string): CommandResult {
  return {
    command,
    durationMilliseconds: 0,
    exitCode: null,
    output: reason,
    status: "SKIPPED",
  };
}

function logStage(name: string): void {
  process.stdout.write(`  - ${name}\n`);
}

function logCommandResult(result: CommandResult): void {
  const durationSeconds = (result.durationMilliseconds / 1000).toFixed(1);
  const exitCode = result.exitCode === null ? "" : `, exit ${result.exitCode}`;
  process.stdout.write(`    result: ${result.status} (${durationSeconds}s${exitCode})\n`);
}

function markdownForCommand(result: CommandResult): string[] {
  const lines = [`- Command: \`${result.command}\``, `- Result: **${result.status}**`];
  if (requiresFallback(result) && result.exitCode !== null) {
    lines.push(`- Exit code: \`${result.exitCode}\``);
  }
  if (result.status !== "OK") {
    lines.push("", "```text", result.output || "(no output)", "```");
  }
  return lines;
}

function markdownForGeneratedFiles(files: GeneratedFile[]): string[] {
  if (files.length === 0) {
    return ["_(no files generated)_"];
  }

  return files.flatMap((file) => {
    let fence = "```";
    while (file.content.includes(fence)) {
      fence += "`";
    }
    return [`#### \`${file.path}\``, "", `${fence}sql`, file.content || "(empty file)", fence, ""];
  });
}

type DeclarativeEngine = "next" | "legacy";
type DeclarativeCommand = "generate" | "sync" | "sync-verification";
type VersionResultStatus = "OK" | "WARNING" | "ERROR";
type DisplayedVersionStatus = VersionResultStatus | "—";
type VersionResultRow = {
  caseName: string;
  command: DeclarativeCommand;
  nextStatus: DisplayedVersionStatus;
  legacyStatus: DisplayedVersionStatus;
  reportName: string;
};

function versionResultStatus(result: CommandResult): VersionResultStatus {
  return result.status === "SKIPPED" ? "ERROR" : result.status;
}

function versionRowSeverity(
  nextStatus: DisplayedVersionStatus,
  legacyStatus: DisplayedVersionStatus,
): number {
  const statuses = [nextStatus, legacyStatus];
  if (statuses.includes("ERROR")) return 0;
  if (statuses.includes("WARNING")) return 1;
  if (statuses.includes("OK")) return 2;
  return 3;
}

function commandResultMarker(
  caseName: string,
  engine: DeclarativeEngine,
  command: DeclarativeCommand,
  result: CommandResult,
): string {
  return `<!-- declarative-schema-command-result case="${caseName}" engine="${engine}" command="${command}" status="${versionResultStatus(result)}" -->`;
}

type ParsedVersionReport = {
  checksum: string;
  cliVersion: string;
  generated: string;
  reportName: string;
  caseResults: Map<string, Map<string, VersionResultStatus>>;
};

function parseVersionReport(reportName: string): ParsedVersionReport | undefined {
  const report = readFileSync(join(reportsDirectory, reportName), "utf8");
  const checksum = /^- Checksum: `([0-9a-f]{7})`$/im.exec(report)?.[1];
  const cliVersion = /^- Supabase CLI version: `([^`]+)`$/m.exec(report)?.[1];
  const generated = /^- Generated: (.+)$/m.exec(report)?.[1];
  if (!checksum || !cliVersion || !generated) {
    return undefined;
  }

  const caseResults = new Map<string, Map<string, VersionResultStatus>>();
  const markerPattern =
    /<!-- declarative-schema-command-result case="([^"]+)" engine="(next|legacy)" command="(generate|sync|sync-verification)" status="(OK|WARNING|ERROR)" -->/g;
  for (const marker of report.matchAll(markerPattern)) {
    const results = caseResults.get(marker[1]) ?? new Map<string, VersionResultStatus>();
    results.set(`${marker[2]}:${marker[3]}`, marker[4] as VersionResultStatus);
    caseResults.set(marker[1], results);
  }
  if (caseResults.size === 0) {
    return undefined;
  }

  return { checksum, cliVersion, generated, reportName, caseResults };
}

function compareCaseNames(left: string, right: string): number {
  const numberDifference = (caseNumberFromName(left) ?? 0) - (caseNumberFromName(right) ?? 0);
  return numberDifference === 0 ? left.localeCompare(right) : numberDifference;
}

function caseAnchor(caseName: string): string {
  return `case-${caseName
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

function existingVersionSnapshots(
  checksum: string,
): Map<string, { reportName: string; results: Map<string, VersionResultStatus> }> {
  const snapshots = new Map<
    string,
    { reportName: string; results: Map<string, VersionResultStatus> }
  >();
  if (!existsSync(versionsDirectory)) return snapshots;

  const datedVersionPattern = new RegExp(`^version-.+-${checksum}\\.md$`);
  const latestDatedVersion = readdirSync(versionsDirectory)
    .filter((versionName) => datedVersionPattern.test(versionName))
    .sort()
    .at(-1);
  const legacyVersionName = `version-${checksum}.md`;
  const versionName =
    latestDatedVersion ??
    (existsSync(join(versionsDirectory, legacyVersionName)) ? legacyVersionName : undefined);
  if (!versionName) return snapshots;

  const versionReport = readFileSync(join(versionsDirectory, versionName), "utf8");
  const rowPattern =
    /^\| `([^`]+)` \| (generate|sync|sync-verification) \| \*\*(OK|WARNING|ERROR|—)\*\* \| \*\*(OK|WARNING|ERROR|—)\*\* \| \[`(report-[^`]+\.md)`\]/gm;
  for (const row of versionReport.matchAll(rowPattern)) {
    const snapshot = snapshots.get(row[1]) ?? {
      reportName: row[5],
      results: new Map<string, VersionResultStatus>(),
    };
    if (row[3] !== "—") snapshot.results.set(`next:${row[2]}`, row[3] as VersionResultStatus);
    if (row[4] !== "—") snapshot.results.set(`legacy:${row[2]}`, row[4] as VersionResultStatus);
    snapshots.set(row[1], snapshot);
  }
  return snapshots;
}

export function updateVersionReportsFromReports(): void {
  const parsedReports = readdirSync(reportsDirectory)
    .filter((reportName) => /^report-.*\.md$/.test(reportName))
    .map(parseVersionReport)
    .filter((report) => report !== undefined)
    .sort(
      (left, right) =>
        left.generated.localeCompare(right.generated) ||
        left.reportName.localeCompare(right.reportName),
    );
  const reportsByChecksum = new Map<string, ParsedVersionReport[]>();
  for (const report of parsedReports) {
    const checksumReports = reportsByChecksum.get(report.checksum) ?? [];
    checksumReports.push(report);
    reportsByChecksum.set(report.checksum, checksumReports);
  }
  mkdirSync(versionsDirectory, { recursive: true });

  for (const [checksum, reports] of reportsByChecksum) {
    const latestCaseSnapshots = existingVersionSnapshots(checksum);
    for (const report of reports) {
      for (const [caseName, results] of report.caseResults) {
        latestCaseSnapshots.set(caseName, { reportName: report.reportName, results });
      }
    }

    const latestReport = reports.at(-1);
    if (!latestReport) continue;
    const versionTimestamp = new Date(latestReport.generated);
    if (Number.isNaN(versionTimestamp.getTime())) {
      throw new Error(
        `Unable to determine the version timestamp from ${latestReport.reportName}: ${latestReport.generated}`,
      );
    }
    const versionDateTime = versionTimestamp
      .toISOString()
      .replaceAll(":", "-")
      .replaceAll(".", "-");
    const commandOrder: DeclarativeCommand[] = ["generate", "sync", "sync-verification"];
    const sourceReportCount = new Set(
      [...latestCaseSnapshots.values()].map((snapshot) => snapshot.reportName),
    ).size;
    const resultRows: VersionResultRow[] = [...latestCaseSnapshots].flatMap(
      ([caseName, snapshot]) =>
        commandOrder.map(
          (command): VersionResultRow => ({
            caseName,
            command,
            nextStatus: snapshot.results.get(`next:${command}`) ?? "—",
            legacyStatus: snapshot.results.get(`legacy:${command}`) ?? "—",
            reportName: snapshot.reportName,
          }),
        ),
    );
    resultRows.sort(
      (left, right) =>
        versionRowSeverity(left.nextStatus, left.legacyStatus) -
          versionRowSeverity(right.nextStatus, right.legacyStatus) ||
        compareCaseNames(left.caseName, right.caseName) ||
        commandOrder.indexOf(left.command) - commandOrder.indexOf(right.command),
    );
    const recordedResults = resultRows.reduce(
      (count, row) => count + Number(row.nextStatus !== "—") + Number(row.legacyStatus !== "—"),
      0,
    );
    const resultLines = resultRows.map(
      (row) =>
        `| \`${row.caseName}\` | ${row.command} | **${row.nextStatus}** | **${row.legacyStatus}** | [\`${row.reportName}\`](../reports/${row.reportName}#${caseAnchor(row.caseName)}) |`,
    );
    const lines = [
      `# Supabase CLI version ${checksum}`,
      "",
      `- Supabase CLI version: \`${latestReport.cliVersion}\``,
      `- Checksum: \`${checksum}\``,
      `- Updated: ${new Date().toISOString()}`,
      `- Source reports: ${sourceReportCount}`,
      `- Cases: ${latestCaseSnapshots.size}`,
      `- Recorded command results: ${recordedResults}`,
      "- A dash means that command was not run. Skipped commands are recorded as `ERROR`.",
      "- Results are ordered by worst status: `ERROR`, `WARNING`, `OK`, then commands that were not run.",
      "",
      "## Command results",
      "",
      "| Case | Command | Next | Legacy | Latest report for case |",
      "| --- | --- | --- | --- | --- |",
      ...resultLines,
      "",
    ];
    writeFileSync(
      join(versionsDirectory, `version-${versionDateTime}-${checksum}.md`),
      lines.join("\n"),
      "utf8",
    );
  }
}

function writeReport(
  results: ProjectResult[],
  runDirectory: string,
  cleanupError?: CommandResult,
): void {
  const projectCommands = results.flatMap((result) => [
    ...(result.reset ? [result.reset] : []),
    result.generate,
    ...(result.legacyGenerate ? [result.legacyGenerate] : []),
    result.sync,
    ...(result.syncVerification ? [result.syncVerification] : []),
    ...(result.legacySync ? [result.legacySync] : []),
    ...(result.legacySyncVerification ? [result.legacySyncVerification] : []),
  ]);
  const okCommands = projectCommands.filter((result) => result.status === "OK").length;
  const warningCommands = projectCommands.filter((result) => result.status === "WARNING").length;
  const failedCommands = projectCommands.filter((result) => result.status === "ERROR").length;
  const skippedCommands = projectCommands.filter((result) => result.status === "SKIPPED").length;

  const lines = [
    "# Supabase declarative schema CLI report",
    "",
    `- Generated: ${new Date().toISOString()}`,
    `- Supabase CLI version: \`${supabaseCliVersion}\``,
    `- Checksum: \`${supabaseChecksum}\``,
    "- Primary engine: pg-delta next (`SUPABASE_USE_PG_DELTA_NEXT=true`)",
    "- Fallback: failed declarative commands are retried with legacy (`SUPABASE_USE_PG_DELTA_NEXT=false`)",
    `- Migration cases: ${results.length}`,
    `- Commands OK: ${okCommands}`,
    `- Commands with warnings: ${warningCommands}`,
    `- Commands failed: ${failedCommands}`,
    `- Commands skipped: ${skippedCommands}`,
    "- Runtime: one shared local PostgreSQL container, reset between projects",
    `- Working copies: \`${relative(scriptDirectory, runDirectory)}\``,
    "",
    '<a id="case-results"></a>',
    "",
    "## Case results",
    "",
    "| Case | Primary | Legacy |",
    "| --- | --- | --- |",
    ...results.map(
      (result) =>
        `| \`${result.name}\` | **${projectStatus(result)}** | **${legacyProjectStatus(result)}** |`,
    ),
    "",
    ...results.map(
      (result) =>
        `<!-- declarative-schema-case-result name="${result.name}" status="${projectStatus(result)}" -->`,
    ),
    "",
  ];

  for (const result of results) {
    lines.push(`<a id="${caseAnchor(result.name)}"></a>`, "", `## ${result.name}`, "");
    const hasIssue = [
      result.reset,
      result.generate,
      result.legacyGenerate,
      result.sync,
      result.syncVerification,
      result.legacySync,
      result.legacySyncVerification,
    ].some((commandResult) => commandResult && requiresFallback(commandResult));
    if (hasIssue) {
      lines.push("### Fixture migration SQL", "", "```sql", result.migrationSql, "```", "");
    }
    if (requiresFallback(result.generate)) {
      lines.push("### Generated declarative files (pg-delta next)", "");
      lines.push(...markdownForGeneratedFiles(result.nextGeneratedFiles ?? []), "");
      lines.push("### Generated declarative files (legacy)", "");
      lines.push(...markdownForGeneratedFiles(result.legacyGeneratedFiles ?? []), "");
    }
    if (result.reset) {
      lines.push("### Reset", "");
      lines.push(...markdownForCommand(result.reset), "");
    }
    lines.push("### Generate (pg-delta next)", "");
    lines.push(
      ...markdownForCommand(result.generate),
      commandResultMarker(result.name, "next", "generate", result.generate),
    );
    if (result.legacyGenerate) {
      lines.push("", "### Generate fallback (legacy)", "");
      lines.push(
        ...markdownForCommand(result.legacyGenerate),
        commandResultMarker(result.name, "legacy", "generate", result.legacyGenerate),
      );
    }
    lines.push("", "### Sync (pg-delta next)", "");
    lines.push(
      ...markdownForCommand(result.sync),
      commandResultMarker(result.name, "next", "sync", result.sync),
      "",
    );
    if (result.syncVerification) {
      lines.push("### Sync verification (pg-delta next)", "");
      lines.push(
        ...markdownForCommand(result.syncVerification),
        commandResultMarker(result.name, "next", "sync-verification", result.syncVerification),
        "",
      );
    }
    if (result.legacySync) {
      lines.push("### Sync fallback (legacy)", "");
      lines.push(
        ...markdownForCommand(result.legacySync),
        commandResultMarker(result.name, "legacy", "sync", result.legacySync),
        "",
      );
    }
    if (result.legacySyncVerification) {
      lines.push("### Sync verification fallback (legacy)", "");
      lines.push(
        ...markdownForCommand(result.legacySyncVerification),
        commandResultMarker(
          result.name,
          "legacy",
          "sync-verification",
          result.legacySyncVerification,
        ),
        "",
      );
    }
  }

  if (cleanupError) {
    lines.push("## Shared runtime cleanup", "");
    lines.push(...markdownForCommand(cleanupError), "");
  }

  writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");
}

function main(): void {
  if (!existsSync(migrationsDirectory)) {
    throw new Error(`Migration cases directory does not exist: ${migrationsDirectory}`);
  }
  if (!existsSync(runtimeTemplateDirectory)) {
    throw new Error(`Runtime template does not exist: ${runtimeTemplateDirectory}`);
  }

  mkdirSync(reportsDirectory, { recursive: true });

  const availableMigrationCases = readdirSync(migrationsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.isSymbolicLink() && entry.name.endsWith(".sql"))
    .map((entry) => ({ fileName: entry.name, name: entry.name.slice(0, -4) }))
    .sort((left, right) => left.name.localeCompare(right.name));

  if (availableMigrationCases.length === 0) {
    throw new Error("Expected at least one migration case.");
  }

  let selectedCaseNumbers: Set<number> | undefined;
  if (caseSelection.kind === "numbers") {
    selectedCaseNumbers = caseSelection.caseNumbers;
  } else if (caseSelection.kind === "latest-failures") {
    const previousReportPath = latestReportPath();
    selectedCaseNumbers = failedCaseNumbersFromReport(previousReportPath);
    process.stdout.write(`Selecting failed cases from ${previousReportPath}\n`);
    if (selectedCaseNumbers.size === 0) {
      throw new Error(`The latest report has no failed cases: ${previousReportPath}`);
    }
  }

  const migrationCases = selectedCaseNumbers
    ? availableMigrationCases.filter((migrationCase) => {
        const caseNumber = caseNumberFromName(migrationCase.name);
        return caseNumber !== undefined && selectedCaseNumbers.has(caseNumber);
      })
    : availableMigrationCases;

  if (migrationCases.length === 0) {
    const availableCaseNumbers = availableMigrationCases
      .map((migrationCase) => /^\d+/.exec(migrationCase.name)?.[0])
      .filter((caseNumber) => caseNumber !== undefined)
      .join(", ");
    throw new Error(`None of the selected cases exist. Available cases: ${availableCaseNumbers}.`);
  }
  if (selectedCaseNumbers) {
    const availableCaseNumbers = new Set(
      availableMigrationCases
        .map((migrationCase) => caseNumberFromName(migrationCase.name))
        .filter((caseNumber) => caseNumber !== undefined),
    );
    const missingCaseNumbers = [...selectedCaseNumbers].filter(
      (caseNumber) => !availableCaseNumbers.has(caseNumber),
    );
    if (missingCaseNumbers.length > 0) {
      throw new Error(`Selected case(s) do not exist: ${missingCaseNumbers.join(", ")}.`);
    }
  }

  mkdirSync(localWorkRoot, { recursive: true });
  const runDirectory = mkdtempSync(join(localWorkRoot, "run-"));
  const controlProject = join(runDirectory, "shared-runtime-control");
  requirePathInside(runDirectory, controlProject);
  cpSync(runtimeTemplateDirectory, controlProject, { recursive: true, errorOnExist: true });
  const results: ProjectResult[] = [];

  logStage("remove stale shared Supabase runtime");
  const startupCleanup = runSupabase(controlProject, ["supabase", "stop", "--no-backup"]);
  logCommandResult(startupCleanup);
  if (startupCleanup.status !== "OK") {
    throw new Error(`Unable to clean the shared runtime:\n${startupCleanup.output}`);
  }

  let finalCleanup: CommandResult | undefined;
  try {
    for (const [caseIndex, migrationCase] of migrationCases.entries()) {
      process.stdout.write(`Testing ${migrationCase.name}...\n`);
      const sourceMigration = join(migrationsDirectory, migrationCase.fileName);
      const workProject = join(runDirectory, basename(migrationCase.name));
      const workMigrations = join(workProject, "supabase", "migrations");
      requirePathInside(runDirectory, workProject);
      requirePathInside(migrationsDirectory, sourceMigration);
      requirePathInside(workProject, workMigrations);
      const sourceMigrationMetadata = lstatSync(sourceMigration);
      if (!sourceMigrationMetadata.isFile() || sourceMigrationMetadata.isSymbolicLink()) {
        throw new Error(`Unsafe migration case: ${sourceMigration}`);
      }
      const migrationSql = readFileSync(sourceMigration, "utf8").trim();
      cpSync(runtimeTemplateDirectory, workProject, { recursive: true, errorOnExist: true });
      mkdirSync(workMigrations);
      copyFileSync(sourceMigration, join(workMigrations, "20260101000000_case.sql"));

      let reset: CommandResult | undefined;
      if (caseIndex > 0) {
        logStage("reset shared database from current fixture migrations");
        reset = runSupabase(workProject, [
          "supabase",
          "db",
          "reset",
          "--local",
          "--no-seed",
          "--debug",
        ]);
        logCommandResult(reset);
      }

      logStage("generate declarative schema from migrations");
      const generateCommand = [
        "supabase",
        "db",
        "schema",
        "declarative",
        "generate",
        "--local",
        ...(caseIndex === 0 ? ["--reset"] : []),
        "--overwrite",
        "--debug",
      ];
      const generate =
        reset?.status === "ERROR"
          ? skippedCommand(
              `npx ${generateCommand.join(" ")}`,
              "Database reset failed, so declarative generation was skipped.",
            )
          : runSupabase(workProject, generateCommand);
      logCommandResult(generate);

      let legacyGenerate: CommandResult | undefined;
      let nextGeneratedFiles: GeneratedFile[] | undefined;
      let legacyGeneratedFiles: GeneratedFile[] | undefined;
      if (requiresFallback(generate)) {
        nextGeneratedFiles = captureGeneratedFiles(workProject);
        process.stdout.write(
          `    captured: ${nextGeneratedFiles.length} pg-delta next generated file(s)\n`,
        );
      }

      const syncCommand = ["supabase", "db", "schema", "declarative", "sync", "--debug"];
      const syncVerificationCommand = [...syncCommand.slice(0, -1), "--no-apply", "--debug"];
      let sync = skippedCommand(
        `npx ${syncCommand.join(" ")}`,
        "Generate failed, so declarative sync was skipped.",
      );
      let migrationRemovalError: string | undefined;
      if (generate.status === "OK" || generate.status === "WARNING") {
        logStage("remove migration SQL from working copy");
        try {
          const removedMigrationCount = removeMigrationSqlFiles(workProject);
          process.stdout.write(`    result: OK (${removedMigrationCount} file(s) removed)\n`);
        } catch (error) {
          migrationRemovalError = error instanceof Error ? error.message : String(error);
          process.stdout.write(`    result: ERROR (${migrationRemovalError})\n`);
        }

        logStage("sync migration from declarative schema with pg-delta next");
        sync = runSupabase(workProject, syncCommand);
        if (migrationRemovalError) {
          sync.output = [
            `Migration cleanup failed before sync: ${migrationRemovalError}`,
            sync.output,
          ]
            .filter(Boolean)
            .join("\n");
          sync.status = "ERROR";
        }
        logCommandResult(sync);
      } else {
        logStage("sync migration from declarative schema with pg-delta next");
        logCommandResult(sync);
      }

      let legacySync: CommandResult | undefined;
      let legacySyncVerification: CommandResult | undefined;
      let syncVerification: CommandResult | undefined;
      if (sync.status !== "ERROR") {
        logStage("verify declarative schema has no remaining changes");
        syncVerification = requireNoSchemaChanges(
          runSupabase(workProject, syncVerificationCommand),
        );
        logCommandResult(syncVerification);
      }

      if (generate.status === "WARNING" || generate.status === "ERROR") {
        removeGeneratedSchema(workProject);
        logStage("retry generate with pg-delta legacy");
        const legacyGenerateCommand = generateCommand.filter((argument) => argument !== "--reset");
        legacyGenerate = runSupabase(workProject, legacyGenerateCommand, "legacy");
        logCommandResult(legacyGenerate);
        legacyGeneratedFiles = captureGeneratedFiles(workProject);
        process.stdout.write(
          `    captured: ${legacyGeneratedFiles.length} legacy generated file(s)\n`,
        );
      }

      if (generate.status === "WARNING") {
        logStage("sync migration from declarative schema with pg-delta legacy");
        legacySync = runSupabase(workProject, syncCommand, "legacy");
        logCommandResult(legacySync);
        if (legacySync.status !== "ERROR") {
          logStage("verify legacy declarative schema has no remaining changes");
          legacySyncVerification = requireNoSchemaChanges(
            runSupabase(workProject, syncVerificationCommand, "legacy"),
          );
          logCommandResult(legacySyncVerification);
        }
      }

      results.push({
        name: migrationCase.name,
        migrationSql,
        reset,
        generate,
        nextGeneratedFiles,
        legacyGenerate,
        legacyGeneratedFiles,
        sync,
        syncVerification,
        legacySync,
        legacySyncVerification,
      });
      writeReport(results, runDirectory);
    }
  } finally {
    logStage("stop shared Supabase runtime");
    finalCleanup = runSupabase(controlProject, ["supabase", "stop", "--no-backup"]);
    logCommandResult(finalCleanup);
    writeReport(results, runDirectory, finalCleanup.status === "ERROR" ? finalCleanup : undefined);
    updateVersionReportsFromReports();
    process.stdout.write(`Version report updated in ${versionsDirectory}\n`);
  }

  if (!finalCleanup) {
    throw new Error("Shared runtime cleanup did not run.");
  }
  const failed = results.some(projectFailed) || finalCleanup.status !== "OK";
  process.stdout.write(`Report written to ${reportPath}\n`);
  process.exitCode = failed ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
