import type {
  CommandResult,
  HttpBehaviorStep,
  RunnerConfig,
} from "./types.mts";
import type { LocalRuntimeEndpoints } from "./project-config.mts";

function replaceTemplates(
  value: string,
  endpoints: LocalRuntimeEndpoints,
): string {
  return value
    .replaceAll("{{API_URL}}", endpoints.apiUrl)
    .replaceAll("{{ANON_KEY}}", endpoints.anonKey)
    .replaceAll("{{SERVICE_ROLE_KEY}}", endpoints.serviceRoleKey);
}

function validatePattern(pattern: string, field: string): RegExp {
  if (pattern.length === 0 || pattern.length > 500) {
    throw new Error(`Invalid ${field}: pattern must contain 1–500 characters.`);
  }
  return new RegExp(pattern, "i");
}

export async function runHttpBehaviorStep(
  config: RunnerConfig,
  endpoints: LocalRuntimeEndpoints,
  step: HttpBehaviorStep,
): Promise<CommandResult> {
  const startedAt = performance.now();
  const url = new URL(replaceTemplates(step.path, endpoints), endpoints.apiUrl);
  const credential = step.credential === "service-role"
    ? endpoints.serviceRoleKey
    : step.credential === "anon"
      ? endpoints.anonKey
      : undefined;
  const headers = new Headers(
    Object.fromEntries(
      Object.entries(step.headers ?? {}).map(([name, value]) => [
        name,
        replaceTemplates(value, endpoints),
      ]),
    ),
  );
  if (credential) {
    headers.set("apikey", credential);
    headers.set("authorization", `Bearer ${credential}`);
  }
  let body: string | undefined;
  if (step.body !== undefined) {
    body = typeof step.body === "string"
      ? replaceTemplates(step.body, endpoints)
      : JSON.stringify(step.body);
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    config.commandTimeoutMilliseconds,
  );
  try {
    const response = await fetch(url, {
      method: step.method,
      headers,
      ...(body === undefined ? {} : { body }),
      signal: controller.signal,
    });
    const responseBody = await response.text();
    const failures: string[] = [];
    if (response.status !== step.expectedStatus) {
      failures.push(
        `expected status ${step.expectedStatus}, received ${response.status}`,
      );
    }
    if (
      step.expectedBodyPattern &&
      !validatePattern(step.expectedBodyPattern, "expectedBodyPattern")
        .test(responseBody)
    ) {
      failures.push(
        `response body did not match /${step.expectedBodyPattern}/i`,
      );
    }
    for (const [name, pattern] of Object.entries(
      step.expectedHeaderPatterns ?? {},
    )) {
      if (!validatePattern(pattern, `header ${name}`).test(
        response.headers.get(name) ?? "",
      )) {
        failures.push(`response header ${name} did not match /${pattern}/i`);
      }
    }
    return {
      command: `${step.method} ${url.origin}${url.pathname}`,
      durationMilliseconds: performance.now() - startedAt,
      exitCode: failures.length === 0 ? 0 : 1,
      output: [
        `HTTP ${response.status}`,
        responseBody,
        ...failures.map((failure) => `Assertion failed: ${failure}`),
      ].filter(Boolean).join("\n"),
      status: failures.length === 0 ? "OK" : "ERROR",
    };
  } catch (error) {
    return {
      command: `${step.method} ${url.origin}${url.pathname}`,
      durationMilliseconds: performance.now() - startedAt,
      exitCode: 1,
      output: error instanceof Error ? error.message : String(error),
      status: "ERROR",
    };
  } finally {
    clearTimeout(timeout);
  }
}
