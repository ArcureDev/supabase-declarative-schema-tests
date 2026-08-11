import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import {
  basename,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import type {
  CoverageCase,
  CoveragePhase,
  HttpBehaviorStep,
  RunnerConfig,
  TestPlane,
} from "./types.mts";
import { localDatabaseContainerForProject } from "./project-config.mts";

function requireInside(parent: string, candidate: string): void {
  const path = relative(resolve(parent), resolve(candidate));
  if (
    path === "" ||
    path === ".." ||
    path.startsWith(`..${sep}`) ||
    isAbsolute(path)
  ) {
    throw new Error(`Coverage fixture path escapes ${parent}: ${candidate}`);
  }
}

function requireFile(parent: string, relativePath: string): string {
  if (
    relativePath.length === 0 ||
    isAbsolute(relativePath) ||
    relativePath.includes("\0")
  ) {
    throw new Error(`Invalid coverage fixture path: ${relativePath}`);
  }
  const path = join(parent, relativePath);
  requireInside(parent, path);
  const metadata = existsSync(path) ? lstatSync(path) : undefined;
  if (!metadata?.isFile() || metadata.isSymbolicLink()) {
    throw new Error(`Coverage fixture file is missing or unsafe: ${path}`);
  }
  return path;
}

function stringArray(
  value: unknown,
  field: string,
  pattern: RegExp,
  allowEmpty = false,
): string[] {
  if (
    !Array.isArray(value) ||
    (!allowEmpty && value.length === 0) ||
    !value.every((entry) => typeof entry === "string" && pattern.test(entry)) ||
    new Set(value).size !== value.length
  ) {
    throw new Error(`Invalid ${field} in coverage manifest.`);
  }
  return value as string[];
}

function behaviorStep(value: unknown): HttpBehaviorStep {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Invalid HTTP request in coverage manifest.");
  }
  const step = value as Record<string, unknown>;
  const methods = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
  if (
    typeof step["description"] !== "string" ||
    !methods.has(String(step["method"])) ||
    typeof step["path"] !== "string" ||
    typeof step["expectedStatus"] !== "number" ||
    !Number.isInteger(step["expectedStatus"]) ||
    step["expectedStatus"] < 100 ||
    step["expectedStatus"] > 599
  ) {
    throw new Error("Invalid HTTP request fields in coverage manifest.");
  }
  const credential = step["credential"];
  if (
    credential !== undefined &&
    credential !== "anon" &&
    credential !== "service-role"
  ) {
    throw new Error("Invalid HTTP request credential in coverage manifest.");
  }
  for (const field of ["headers", "expectedHeaderPatterns"]) {
    const candidate = step[field];
    if (
      candidate !== undefined &&
      (typeof candidate !== "object" ||
        candidate === null ||
        Array.isArray(candidate) ||
        !Object.values(candidate).every((entry) => typeof entry === "string"))
    ) {
      throw new Error(`Invalid HTTP request ${field} in coverage manifest.`);
    }
  }
  if (
    step["expectedBodyPattern"] !== undefined &&
    typeof step["expectedBodyPattern"] !== "string"
  ) {
    throw new Error("Invalid expectedBodyPattern in coverage manifest.");
  }
  return step as HttpBehaviorStep;
}

function coveragePhase(
  value: unknown,
  directory: string,
  knownIds: Set<string>,
): CoveragePhase {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Invalid phase in coverage manifest.");
  }
  const phase = value as Record<string, unknown>;
  if (
    typeof phase["id"] !== "string" ||
    !/^[a-z][a-z0-9-]*$/.test(phase["id"]) ||
    knownIds.has(phase["id"]) ||
    typeof phase["title"] !== "string" ||
    phase["title"].trim().length === 0
  ) {
    throw new Error("Invalid phase identity in coverage manifest.");
  }
  const dependsOn = phase["dependsOn"] === undefined
    ? []
    : stringArray(
        phase["dependsOn"],
        `dependsOn for phase ${phase["id"]}`,
        /^[a-z][a-z0-9-]*$/,
        true,
      );
  if (dependsOn.some((dependency) => !knownIds.has(dependency))) {
    throw new Error(
      `Phase ${phase["id"]} depends on an unknown or later phase.`,
    );
  }
  const acceptStatuses = phase["acceptStatuses"] === undefined
    ? undefined
    : stringArray(
        phase["acceptStatuses"],
        `acceptStatuses for phase ${phase["id"]}`,
        /^(?:OK|WARNING|ERROR)$/,
      );
  const requiredOutputPatterns = phase["requiredOutputPatterns"] === undefined
    ? undefined
    : stringArray(
        phase["requiredOutputPatterns"],
        `requiredOutputPatterns for phase ${phase["id"]}`,
        /^[\s\S]{1,500}$/,
        true,
      );
  const forbiddenOutputPatterns = phase["forbiddenOutputPatterns"] === undefined
    ? undefined
    : stringArray(
        phase["forbiddenOutputPatterns"],
        `forbiddenOutputPatterns for phase ${phase["id"]}`,
        /^[\s\S]{1,500}$/,
        true,
      );
  for (const pattern of [
    ...(requiredOutputPatterns ?? []),
    ...(forbiddenOutputPatterns ?? []),
  ]) {
    try {
      new RegExp(pattern, "i");
    } catch {
      throw new Error(`Invalid output pattern for phase ${phase["id"]}.`);
    }
  }
  knownIds.add(phase["id"]);
  const base = {
    id: phase["id"],
    title: phase["title"].trim(),
    ...(dependsOn.length > 0 ? { dependsOn } : {}),
    ...(acceptStatuses ? {
      acceptStatuses: acceptStatuses as Array<"OK" | "WARNING" | "ERROR">,
    } : {}),
    ...(requiredOutputPatterns ? { requiredOutputPatterns } : {}),
    ...(forbiddenOutputPatterns ? { forbiddenOutputPatterns } : {}),
  };
  if (phase["kind"] === "supabase") {
    if (
      phase["engine"] !== undefined &&
      phase["engine"] !== "next" &&
      phase["engine"] !== "legacy"
    ) {
      throw new Error(`Invalid engine for phase ${phase["id"]}.`);
    }
    return {
      ...base,
      kind: "supabase",
      args: stringArray(
        phase["args"],
        `args for phase ${phase["id"]}`,
        /^\S(?:.*\S)?$/,
      ),
      ...(phase["engine"] ? {
        engine: phase["engine"] as "next" | "legacy",
      } : {}),
    };
  }
  if (phase["kind"] === "sql") {
    if (typeof phase["file"] !== "string") {
      throw new Error(`Invalid SQL file for phase ${phase["id"]}.`);
    }
    requireFile(directory, phase["file"]);
    return { ...base, kind: "sql", file: phase["file"] };
  }
  if (phase["kind"] === "runtime-status") {
    return { ...base, kind: "runtime-status" };
  }
  if (phase["kind"] === "script") {
    if (typeof phase["file"] !== "string") {
      throw new Error(`Invalid script file for phase ${phase["id"]}.`);
    }
    requireFile(directory, phase["file"]);
    return {
      ...base,
      kind: "script",
      file: phase["file"],
      args: phase["args"] === undefined
        ? []
        : stringArray(
            phase["args"],
            `args for phase ${phase["id"]}`,
            /^\S(?:.*\S)?$/,
            true,
          ),
    };
  }
  if (phase["kind"] === "http") {
    return {
      ...base,
      kind: "http",
      request: behaviorStep(phase["request"]),
    };
  }
  throw new Error(`Unsupported coverage phase kind: ${String(phase["kind"])}.`);
}

function discoverDirectories(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .flatMap((entry) => {
      const child = join(directory, entry.name);
      return existsSync(join(child, "coverage.json"))
        ? [child]
        : discoverDirectories(child);
    });
}

export function discoverCoverageCases(config: RunnerConfig): CoverageCase[] {
  return discoverDirectories(config.coverageDirectory).map((directory) => {
    const manifestPath = requireFile(directory, "coverage.json");
    const projectDirectory = join(directory, "project");
    requireInside(directory, projectDirectory);
    const projectMetadata = existsSync(projectDirectory)
      ? lstatSync(projectDirectory)
      : undefined;
    if (!projectMetadata?.isDirectory() || projectMetadata.isSymbolicLink()) {
      throw new Error(`Coverage fixture is missing a safe project: ${projectDirectory}`);
    }
    requireFile(projectDirectory, join("supabase", "config.toml"));
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<
      string,
      unknown
    >;
    const planes = new Set<TestPlane>([
      "service",
      "functions",
      "config",
      "remote",
    ]);
    if (
      typeof manifest["description"] !== "string" ||
      manifest["description"].trim().length === 0 ||
      typeof manifest["plane"] !== "string" ||
      !planes.has(manifest["plane"] as TestPlane)
    ) {
      throw new Error(`Invalid coverage metadata in ${manifestPath}.`);
    }
    const requirements = stringArray(
      manifest["requirements"],
      "requirements",
      /^[A-Z][A-Z0-9]*$/,
    );
    const sensitiveValues = manifest["sensitiveValues"] === undefined
      ? []
      : stringArray(
          manifest["sensitiveValues"],
          "sensitiveValues",
          /^.{8,200}$/,
          true,
        );
    const requiredEnvironment = manifest["requiredEnvironment"] === undefined
      ? []
      : stringArray(
          manifest["requiredEnvironment"],
          "requiredEnvironment",
          /^[A-Z][A-Z0-9_]*$/,
          true,
        );
    if (!Array.isArray(manifest["phases"]) || manifest["phases"].length === 0) {
      throw new Error(`Coverage manifest has no phases: ${manifestPath}.`);
    }
    const knownIds = new Set<string>();
    const phases = manifest["phases"].map((phase) =>
      coveragePhase(phase, directory, knownIds)
    );
    const plane = manifest["plane"] as CoverageCase["plane"];
    if (
      plane !== "remote" &&
      localDatabaseContainerForProject(config, projectDirectory) !==
        config.localDatabaseContainer
    ) {
      throw new Error(
        `Local coverage fixture ${basename(directory)} must reuse the shared runtime project_id.`,
      );
    }
    return {
      kind: "coverage",
      name: basename(directory),
      directory,
      projectDirectory,
      description: manifest["description"].trim(),
      plane,
      requirements,
      sensitiveValues,
      requiredEnvironment,
      phases,
      remote: plane === "remote",
    };
  });
}
