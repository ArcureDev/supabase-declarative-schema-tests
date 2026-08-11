import {
  cpSync,
  readFileSync,
} from "node:fs";
import {
  basename,
  join,
} from "node:path";
import {
  runDatabaseQuery,
  runNodeScript,
  runSupabase,
} from "./commands.mts";
import { requirePathInside } from "./files.mts";
import { runHttpBehaviorStep } from "./http-assertions.mts";
import { runPhasePipeline } from "./phase-pipeline.mts";
import {
  parseLocalRuntimeEndpoints,
  type LocalRuntimeEndpoints,
} from "./project-config.mts";
import type {
  CaseRunContext,
  CommandResult,
  CoverageCase,
  CoveragePhase,
  PhaseResult,
  ProjectResult,
} from "./types.mts";

function failedResult(command: string, error: unknown): CommandResult {
  return {
    command,
    durationMilliseconds: 0,
    exitCode: 1,
    output: error instanceof Error ? error.message : String(error),
    status: "ERROR",
  };
}

function environmentArgument(
  value: string,
  requiredEnvironment: Set<string>,
): string {
  return value.replace(
    /\{\{ENV:([A-Z][A-Z0-9_]*)\}\}/g,
    (_template, name: string) => {
      if (!requiredEnvironment.has(name)) {
        throw new Error(`Environment template ${name} is not declared as required.`);
      }
      const resolved = process.env[name];
      if (!resolved) throw new Error(`Required environment variable is missing: ${name}.`);
      return resolved;
    },
  );
}

function assertPhaseOutput(
  phase: CoveragePhase,
  result: CommandResult,
): CommandResult {
  const accepted = phase.acceptStatuses ?? ["OK"];
  const failures: string[] = [];
  if (!accepted.includes(result.status)) {
    failures.push(
      `status ${result.status} was not one of ${accepted.join(", ")}`,
    );
  }
  for (const pattern of phase.requiredOutputPatterns ?? []) {
    if (!new RegExp(pattern, "i").test(result.output)) {
      failures.push(`output did not match required /${pattern}/i`);
    }
  }
  for (const pattern of phase.forbiddenOutputPatterns ?? []) {
    if (new RegExp(pattern, "i").test(result.output)) {
      failures.push(`output matched forbidden /${pattern}/i`);
    }
  }
  return failures.length === 0
    ? { ...result, status: "OK" }
    : {
        ...result,
        output: [
          result.output,
          ...failures.map((failure) => `Assertion failed: ${failure}`),
        ].filter(Boolean).join("\n"),
        status: "ERROR",
      };
}

export async function runCoverageCase(
  testCase: CoverageCase,
  context: CaseRunContext,
): Promise<ProjectResult> {
  const missingEnvironment = testCase.requiredEnvironment.filter(
    (name) => !process.env[name],
  );
  if (missingEnvironment.length > 0) {
    throw new Error(
      `Coverage case ${testCase.name} requires environment variable(s): ${missingEnvironment.join(", ")}.`,
    );
  }
  const workProject = join(
    context.runDirectory,
    `${basename(testCase.name)}-coverage`,
  );
  requirePathInside(context.runDirectory, workProject);
  cpSync(testCase.projectDirectory, workProject, {
    recursive: true,
    errorOnExist: true,
  });

  let endpoints: LocalRuntimeEndpoints | undefined;
  const phaseResults = await runPhasePipeline(
    context.config,
    testCase.phases.map((phase) => ({
      id: phase.id,
      title: phase.title,
      plane: testCase.plane,
      dependsOn: phase.dependsOn,
      run: async (
        _completed: ReadonlyMap<string, PhaseResult>,
      ): Promise<CommandResult> => {
        let result: CommandResult;
        if (phase.kind === "supabase") {
          const environmentNames = new Set(testCase.requiredEnvironment);
          const resolvedArgs = phase.args.map((argument) =>
            environmentArgument(argument, environmentNames)
          );
          result = await runSupabase(
              context.config,
              workProject,
              ["supabase", ...resolvedArgs],
              phase.engine ?? context.pgDeltaEngine ?? "next",
            );
          // A verbose task must not echo credential values substituted into
          // arguments, even though the final report is redacted as a backstop.
          for (const name of testCase.requiredEnvironment) {
            const value = process.env[name];
            if (value) result.command = result.command.replaceAll(value, `\${${name}}`);
          }
        } else if (phase.kind === "sql") {
          const sqlPath = join(testCase.directory, phase.file);
          requirePathInside(testCase.directory, sqlPath);
          result = await runDatabaseQuery(
            context.config,
            workProject,
            readFileSync(sqlPath, "utf8"),
          );
        } else if (phase.kind === "runtime-status") {
          result = await runSupabase(
            context.config,
            workProject,
            ["supabase", "status", "-o", "json"],
          );
          if (result.status === "OK") {
            try {
              endpoints = parseLocalRuntimeEndpoints(result.output);
            } catch (error) {
              result = {
                ...result,
                exitCode: 1,
                output: [
                  result.output,
                  error instanceof Error ? error.message : String(error),
                ].join("\n"),
                status: "ERROR",
              };
            }
          }
        } else if (phase.kind === "script") {
          const scriptPath = join(testCase.directory, phase.file);
          requirePathInside(testCase.directory, scriptPath);
          const environmentNames = new Set(testCase.requiredEnvironment);
          result = await runNodeScript(
            context.config,
            workProject,
            scriptPath,
            phase.args.map((argument) =>
              environmentArgument(argument, environmentNames)
            ),
            {
              ...(endpoints
                ? {
                    SUPABASE_API_URL: endpoints.apiUrl,
                    SUPABASE_ANON_KEY: endpoints.anonKey,
                    SUPABASE_SERVICE_ROLE_KEY: endpoints.serviceRoleKey,
                  }
                : {}),
            },
          );
        } else if (!endpoints) {
          result = failedResult(
              `${phase.request.method} ${phase.request.path}`,
              "HTTP behavior requires a successful runtime-status phase.",
            );
        } else {
          result = await runHttpBehaviorStep(
            context.config,
            endpoints,
            phase.request,
          );
        }
        return assertPhaseOutput(phase, result);
      },
    })),
  );
  const finalResult = phaseResults.at(-1)?.commandResult ??
    failedResult("coverage", "Coverage case did not define any phases.");
  return {
    kind: "coverage",
    name: testCase.name,
    migrationSql: `-- ${testCase.description}`,
    sensitiveValues: [
      ...testCase.sensitiveValues,
      ...testCase.requiredEnvironment.flatMap((name) => {
        const value = process.env[name];
        return value ? [value] : [];
      }),
    ],
    coverageDescription: testCase.description,
    coverageRequirements: testCase.requirements,
    sync: finalResult,
    phaseResults,
  };
}
