import { spawn } from "node:child_process";
import { Listr } from "listr2";
import { localDatabaseContainerForProject } from "./project-config.mts";
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
): Promise<CommandResult> {
  const command = `npx ${args.join(" ")}`;
  const cliArguments = args[0] === "supabase" ? args.slice(1) : args;
  return runProcess(
    process.execPath,
    [config.supabaseCliEntry, ...cliArguments],
    {
      command,
      cwd: workProject,
      env: {
        ...process.env,
        SUPABASE_USE_PG_DELTA_NEXT: pgDeltaEngine === "next" ? "true" : "false",
      },
      timeoutMilliseconds: config.commandTimeoutMilliseconds,
    },
    (result) => {
      const hasUnmodeledKind = /\bcode=unmodeled_kind\b/.test(result.output);
      return {
        ...result,
        output: hasUnmodeledKind
          ? [
              "Warning: the CLI exited successfully but reported an unmodeled object kind; the exported declarative schema is incomplete.",
              result.output,
            ].join("\n")
          : result.output,
        status:
          result.exitCode !== 0 ? "ERROR" : hasUnmodeledKind ? "WARNING" : "OK",
      };
    },
  );
}

export function runDatabaseQuery(
  config: RunnerConfig,
  workProject: string,
  sql: string,
): Promise<CommandResult> {
  const dockerArguments = [
    "exec",
    "--interactive",
    localDatabaseContainerForProject(config, workProject),
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
  return runProcess(
    "docker",
    dockerArguments,
    {
      command,
      cwd: workProject,
      input: sql,
      timeoutMilliseconds: config.commandTimeoutMilliseconds,
    },
    (result) => ({
      ...result,
      status: result.exitCode === 0 ? "OK" : "ERROR",
    }),
  );
}

export function runNodeScript(
  config: RunnerConfig,
  workProject: string,
  scriptPath: string,
  args: string[] = [],
  environment: NodeJS.ProcessEnv = {},
): Promise<CommandResult> {
  const nodeArguments = [
    "--experimental-strip-types",
    scriptPath,
    ...args,
  ];
  return runProcess(
    process.execPath,
    nodeArguments,
    {
      command: `node --experimental-strip-types ${scriptPath} ${args.join(" ")}`.trim(),
      cwd: workProject,
      env: { ...process.env, ...environment },
      timeoutMilliseconds: config.commandTimeoutMilliseconds,
    },
    (result) => ({
      ...result,
      status: result.exitCode === 0 ? "OK" : "ERROR",
    }),
  );
}

type ProcessOptions = {
  command: string;
  cwd: string;
  env?: NodeJS.ProcessEnv;
  input?: string;
  timeoutMilliseconds: number;
};

function runProcess(
  executable: string,
  args: string[],
  options: ProcessOptions,
  finalize: (result: Omit<CommandResult, "status">) => CommandResult,
): Promise<CommandResult> {
  return new Promise((resolve) => {
    const startedAt = performance.now();
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    const child = spawn(executable, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: "pipe",
      timeout: options.timeoutMilliseconds,
    });
    let spawnError: Error | undefined;

    child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
    child.on("error", (error) => {
      spawnError = error;
    });
    child.on("close", (exitCode) => {
      const commandOutput = normalizedOutput(Buffer.concat(stdout), Buffer.concat(stderr));
      resolve(
        finalize({
          command: options.command,
          durationMilliseconds: performance.now() - startedAt,
          exitCode,
          output: [commandOutput, spawnError?.message].filter(Boolean).join("\n"),
        }),
      );
    });
    child.stdin.end(options.input);
  });
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

export async function runCommandTask(
  config: RunnerConfig,
  title: string,
  command: () => Promise<CommandResult> | CommandResult,
  failureDetail?: (result: CommandResult) => string | undefined,
): Promise<CommandResult> {
  let result: CommandResult | undefined;
  const list = new Listr(
    [
      {
        title,
        task: async (_context, task) => {
          result = await command();
          if (result.status !== "SKIPPED") {
            task.title = `${title} (${formatDuration(result.durationMilliseconds)})`;
          }
          if (config.verbose) {
            task.output = result.command;
          }
          if (result.status === "SKIPPED") {
            task.skip(result.output);
          } else if (result.status === "WARNING") {
            task.title = `${title} (${formatDuration(result.durationMilliseconds)}) — warning`;
            task.output = result.output.split("\n")[0] ?? "The command completed with a warning.";
          } else if (result.status === "ERROR") {
            const detail = failureDetail?.(result) ?? describeCommandFailure(result);
            throw new Error(detail);
          }
        },
      },
    ],
    {
      exitOnError: false,
      rendererOptions: {
        collapseErrors: false,
      },
    },
  );
  await list.run();
  if (!result) {
    throw new Error(`Task did not produce a result: ${title}`);
  }
  return result;
}

export function describeCommandFailure(result: CommandResult): string {
  if (result.exitCode === 0) {
    return "The command exited successfully, but the runner check failed.";
  }
  return result.exitCode === null
    ? "The command could not be started or was terminated."
    : `The command exited with code ${result.exitCode}.`;
}

function formatDuration(durationMilliseconds: number): string {
  return `${(durationMilliseconds / 1000).toFixed(1)}s`;
}

export type ActionResult<T> =
  | { status: "OK"; value: T }
  | { status: "ERROR"; error: string };

export async function runActionTask<T>(
  title: string,
  action: () => T,
  successDetail?: (value: T) => string,
): Promise<ActionResult<T>> {
  let result: ActionResult<T> | undefined;
  const list = new Listr(
    [
      {
        title,
        task: (_context, task) => {
          const startedAt = performance.now();
          try {
            const value = action();
            result = { status: "OK", value };
            const detail = successDetail?.(value);
            const suffix = [detail, formatDuration(performance.now() - startedAt)]
              .filter(Boolean)
              .join(", ");
            task.title = `${title} (${suffix})`;
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            result = { status: "ERROR", error: message };
            task.title = `${title} (${formatDuration(performance.now() - startedAt)})`;
            throw error;
          }
        },
      },
    ],
    {
      exitOnError: false,
      rendererOptions: {
        collapseErrors: false,
      },
    },
  );
  await list.run();
  if (!result) {
    throw new Error(`Task did not produce a result: ${title}`);
  }
  return result;
}
