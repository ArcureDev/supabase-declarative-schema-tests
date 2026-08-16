import { existsSync, lstatSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import type { MigrationPatternAssertion } from "./types.mts";

export const CATALOGUE_ATOM_PATTERN =
  /^PG-CAT-(?:STC|CIX|PRT|TYP|VIW|RTN|ROL|PUB|FTS|EXT|BND)-\d{2}::[a-z0-9]+(?:[.-][a-z0-9]+)*(?:@[a-z0-9-]+)?$/;

export const SCENARIO_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const DECLARATIVE_FILE_PATTERN = /^[a-z0-9][a-z0-9-]*\.sql$/;
export const QUALIFIED_IDENTIFIER_PATTERN = /^[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$/;
export const REQUIREMENT_ID_PATTERN = /^[A-Z][A-Z0-9]*$/;

export function requirePathInside(parent: string, candidate: string): void {
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

export function requireSafeFile(parent: string, candidate: string): string {
  requirePathInside(parent, candidate);
  const metadata = existsSync(candidate) ? lstatSync(candidate) : undefined;
  if (!metadata?.isFile() || metadata.isSymbolicLink()) {
    throw new Error(`Transition fixture is missing a safe file: ${candidate}`);
  }
  return candidate;
}

export function requireRelativeSafeFile(parent: string, relativePath: string): string {
  if (
    relativePath.length === 0 ||
    isAbsolute(relativePath) ||
    relativePath.includes("\0")
  ) {
    throw new Error(`Invalid fixture path: ${relativePath}`);
  }
  return requireSafeFile(parent, join(parent, relativePath));
}

export function requireMigrationPatterns(
  value: unknown,
  fieldName: string,
  manifestPath: string,
): MigrationPatternAssertion[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid ${fieldName} in ${manifestPath}.`);
  }
  return value.map((candidate, index) => {
    if (
      typeof candidate !== "object" ||
      candidate === null ||
      Array.isArray(candidate)
    ) {
      throw new Error(`Invalid ${fieldName}[${index}] in ${manifestPath}.`);
    }
    const assertion = candidate as Record<string, unknown>;
    if (
      typeof assertion["description"] !== "string" ||
      assertion["description"].trim().length === 0 ||
      typeof assertion["pattern"] !== "string" ||
      assertion["pattern"].length === 0 ||
      assertion["pattern"].length > 500
    ) {
      throw new Error(`Invalid ${fieldName}[${index}] in ${manifestPath}.`);
    }
    try {
      new RegExp(assertion["pattern"], "i");
    } catch {
      throw new Error(
        `Invalid regular expression in ${fieldName}[${index}] in ${manifestPath}.`,
      );
    }
    return {
      description: assertion["description"].trim(),
      pattern: assertion["pattern"],
    };
  });
}

export function requireQualifiedIdentifier(
  value: unknown,
  fieldName: string,
  manifestPath: string,
): string {
  if (typeof value !== "string" || !QUALIFIED_IDENTIFIER_PATTERN.test(value)) {
    throw new Error(`Invalid ${fieldName} in ${manifestPath}.`);
  }
  return value;
}

export function requireStringArray(
  value: unknown,
  fieldName: string,
  pattern: RegExp,
  manifestPath: string,
  allowEmpty = true,
): string[] {
  if (value === undefined) {
    if (!allowEmpty) {
      throw new Error(`Invalid ${fieldName} in ${manifestPath}.`);
    }
    return [];
  }
  if (
    !Array.isArray(value) ||
    (!allowEmpty && value.length === 0) ||
    !value.every((entry) => typeof entry === "string" && pattern.test(entry)) ||
    new Set(value).size !== value.length
  ) {
    throw new Error(`Invalid ${fieldName} in ${manifestPath}.`);
  }
  return value as string[];
}

export function requireCatalogueAtoms(
  value: unknown,
  manifestPath: string,
): string[] {
  return requireStringArray(
    value,
    "catalogueAtoms",
    CATALOGUE_ATOM_PATTERN,
    manifestPath,
  );
}

export function requireSensitiveValues(
  value: unknown,
  manifestPath: string,
): string[] {
  if (value === undefined) return [];
  if (
    !Array.isArray(value) ||
    !value.every(
      (entry) =>
        typeof entry === "string" && entry.length >= 8 && entry.length <= 200,
    ) ||
    new Set(value).size !== value.length
  ) {
    throw new Error(`Invalid sensitiveValues in ${manifestPath}.`);
  }
  return value as string[];
}

export function requireRequirements(
  value: unknown,
  manifestPath: string,
): string[] {
  return requireStringArray(
    value,
    "requirements",
    REQUIREMENT_ID_PATTERN,
    manifestPath,
  );
}

export function renderPackPlaceholders(
  text: string,
  values: Record<string, string>,
): string {
  return text.replaceAll(/\{\{([a-zA-Z][a-zA-Z0-9]*)\}\}/g, (match, name: string) => {
    const replacement = values[name];
    if (replacement === undefined) {
      throw new Error(`Unknown pack placeholder ${match}.`);
    }
    return replacement;
  });
}
