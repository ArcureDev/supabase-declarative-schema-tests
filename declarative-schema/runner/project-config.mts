import {
  existsSync,
  readFileSync,
} from "node:fs";
import { join } from "node:path";
import type { RunnerConfig } from "./types.mts";

export type LocalRuntimeEndpoints = {
  apiUrl: string;
  anonKey: string;
  serviceRoleKey: string;
};

export function projectIdFromConfig(configPath: string): string {
  const projectId = /^project_id\s*=\s*"([^"]+)"$/m.exec(
    readFileSync(configPath, "utf8"),
  )?.[1];
  if (!projectId || !/^[a-zA-Z0-9_-]+$/.test(projectId)) {
    throw new Error(`Unable to determine a safe project_id from ${configPath}.`);
  }
  return projectId;
}

export function localDatabaseContainerForProject(
  config: RunnerConfig,
  workProject: string,
): string {
  const configPath = join(workProject, "supabase", "config.toml");
  if (!existsSync(configPath)) return config.localDatabaseContainer;
  return `supabase_db_${projectIdFromConfig(configPath)}`;
}

function stringProperty(
  object: Record<string, unknown>,
  names: string[],
): string | undefined {
  for (const name of names) {
    const value = object[name];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

export function parseLocalRuntimeEndpoints(output: string): LocalRuntimeEndpoints {
  const start = output.indexOf("{");
  const end = output.lastIndexOf("}");
  if (start < 0 || end < start) {
    throw new Error("Supabase status did not contain a JSON object.");
  }
  const parsed = JSON.parse(output.slice(start, end + 1)) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Supabase status JSON must be an object.");
  }
  const status = parsed as Record<string, unknown>;
  const apiUrl = stringProperty(status, ["API_URL", "api_url", "apiUrl"]);
  const anonKey = stringProperty(status, ["ANON_KEY", "anon_key", "anonKey"]);
  const serviceRoleKey = stringProperty(status, [
    "SERVICE_ROLE_KEY",
    "service_role_key",
    "serviceRoleKey",
  ]);
  if (!apiUrl || !anonKey || !serviceRoleKey) {
    throw new Error(
      "Supabase status JSON is missing API URL, anon key, or service-role key.",
    );
  }
  return { apiUrl, anonKey, serviceRoleKey };
}
