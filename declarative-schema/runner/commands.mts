import { spawnSync } from "node:child_process";
import type {
  CommandResult,
  PgDeltaEngine,
  RunnerConfig,
} from "./types.mts";

export function normalizedOutput(
  stdout: string | Buffer | null,
  stderr: string | Buffer | null,
): string {
  const ansiEscapePattern = new RegExp(String.raw`${String.fromCodePoint(27)}\[[0-?]*[ -/]*[@-~]`, "g");
  return `${stdout ?? ""}${stderr ?? ""}`
    .replace(ansiEscapePattern, "")
    .replaceAll('\r\n', "\n")
    .trim();
}

export function runSupabase(
  config: RunnerConfig,
  workProject: string,
  args: string[],
  pgDeltaEngine: PgDeltaEngine = "next",
): CommandResult {
  const command = `npx ${args.join(" ")}`;
  if (config.verbose) {
    process.stdout.write(`    env: SUPABASE_USE_PG_DELTA_NEXT=${pgDeltaEngine === "next"}\n`);
    process.stdout.write(`    command: ${command}\n`);
  }
  const cliArguments = args[0] === "supabase" ? args.slice(1) : args;
  const startedAt = performance.now();
  const result = spawnSync(process.execPath, [config.supabaseCliEntry, ...cliArguments], {
    cwd: workProject,
    encoding: "utf8",
    env: {
      ...process.env,
      SUPABASE_USE_PG_DELTA_NEXT: pgDeltaEngine === "next" ? "true" : "false",
    },
    timeout: config.commandTimeoutMilliseconds,
  });
  const durationMilliseconds = performance.now() - startedAt;
  const commandOutput = normalizedOutput(result.stdout, result.stderr);

  if (result.error) {
    return {
      command,
      durationMilliseconds,
      exitCode: result.status,
      output: [commandOutput, result.error.message].filter(Boolean).join("\n"),
      status: "ERROR",
    };
  }

  const hasUnmodeledKind = /\bcode=unmodeled_kind\b/.test(commandOutput);
  return {
    command,
    durationMilliseconds,
    exitCode: result.status,
    output: hasUnmodeledKind
      ? [
          "Warning: the CLI exited successfully but reported an unmodeled object kind; the exported declarative schema is incomplete.",
          commandOutput,
        ].join("\n")
      : commandOutput,
    status: result.status !== 0 ? "ERROR" : hasUnmodeledKind ? "WARNING" : "OK",
  };
}

export function runDatabaseQuery(
  config: RunnerConfig,
  workProject: string,
  sql: string,
): CommandResult {
  const dockerArguments = [
    "exec",
    "--interactive",
    config.localDatabaseContainer,
    "psql",
    "--username",
    "postgres",
    "--dbname",
    "postgres",
    "--no-psqlrc",
    "--tuples-only",
    "--no-align",
    "--set",
    "ON_ERROR_STOP=1",
    "--file",
    "-",
  ];
  const command = `docker ${dockerArguments.join(" ")}`;
  if (config.verbose) {
    process.stdout.write(`    command: ${command}\n`);
  }
  const startedAt = performance.now();
  const result = spawnSync("docker", dockerArguments, {
    cwd: workProject,
    encoding: "utf8",
    input: sql,
    timeout: config.commandTimeoutMilliseconds,
  });
  const durationMilliseconds = performance.now() - startedAt;
  const commandOutput = normalizedOutput(result.stdout, result.stderr);
  if (result.error) {
    return {
      command,
      durationMilliseconds,
      exitCode: result.status,
      output: [commandOutput, result.error.message].filter(Boolean).join("\n"),
      status: "ERROR",
    };
  }
  return {
    command,
    durationMilliseconds,
    exitCode: result.status,
    output: commandOutput,
    status: result.status === 0 ? "OK" : "ERROR",
  };
}

export function skippedCommand(command: string, reason: string): CommandResult {
  return {
    command,
    durationMilliseconds: 0,
    exitCode: null,
    output: reason,
    status: "SKIPPED",
  };
}

export function logStage(name: string): void {
  process.stdout.write(`  - ${name}\n`);
}

export function logCommandResult(result: CommandResult): void {
  const durationSeconds = (result.durationMilliseconds / 1000).toFixed(1);
  const exitCode = result.exitCode === null ? "" : `, exit ${result.exitCode}`;
  process.stdout.write(`    result: ${result.status} (${durationSeconds}s${exitCode})\n`);
}
