import {
  runCommandTask,
  skippedCommand,
} from "./commands.mts";
import type {
  CommandResult,
  PhaseResult,
  RunnerConfig,
  TestPlane,
} from "./types.mts";

export type PipelinePhase = {
  id: string;
  title: string;
  plane: TestPlane;
  dependsOn?: string[] | undefined;
  run: (completed: ReadonlyMap<string, PhaseResult>) =>
    Promise<CommandResult> | CommandResult;
};

function validatePipeline(phases: PipelinePhase[]): void {
  const known = new Set<string>();
  for (const phase of phases) {
    if (!/^[a-z][a-z0-9-]*$/.test(phase.id) || known.has(phase.id)) {
      throw new Error(`Invalid or duplicate pipeline phase ID: ${phase.id}.`);
    }
    for (const dependency of phase.dependsOn ?? []) {
      // Requiring dependencies to precede their consumer makes phase order
      // visible in the manifest and prevents accidental execution cycles.
      if (!known.has(dependency)) {
        throw new Error(
          `Pipeline phase ${phase.id} depends on unknown or later phase ${dependency}.`,
        );
      }
    }
    known.add(phase.id);
  }
}

/**
 * Executes a case as explicit phases while preserving independent diagnostics:
 * a failed dependency skips only its consumers, not unrelated cleanup or
 * evidence-capture phases.
 */
export async function runPhasePipeline(
  config: RunnerConfig,
  phases: PipelinePhase[],
): Promise<PhaseResult[]> {
  validatePipeline(phases);
  const completed = new Map<string, PhaseResult>();
  for (const phase of phases) {
    const blockedBy = (phase.dependsOn ?? []).filter(
      (dependency) =>
        completed.get(dependency)?.commandResult.status !== "OK",
    );
    const commandResult = await runCommandTask(
      config,
      phase.title,
      () =>
        blockedBy.length === 0
          ? phase.run(completed)
          : skippedCommand(
              `phase:${phase.id}`,
              `Blocked by unsuccessful phase(s): ${blockedBy.join(", ")}.`,
            ),
    );
    completed.set(phase.id, {
      id: phase.id,
      title: phase.title,
      plane: phase.plane,
      commandResult,
    });
  }
  return [...completed.values()];
}
