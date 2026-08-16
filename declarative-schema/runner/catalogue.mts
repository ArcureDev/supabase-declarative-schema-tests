import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOGUE_ATOM_PATTERN } from "./manifest-validation.mts";

export const CATALOGUE_SECTIONS = [
  "STC",
  "CIX",
  "PRT",
  "TYP",
  "VIW",
  "RTN",
  "ROL",
  "PUB",
  "FTS",
  "EXT",
  "BND",
] as const;

export type CatalogueSection = (typeof CATALOGUE_SECTIONS)[number];
export type CatalogueEvidence = "transition" | "diagnostic" | "runtime-boundary";

export type CatalogueAtom = {
  id: string;
  verbs: string[];
  objects: string[];
  facets: string[];
  evidence: CatalogueEvidence[];
};

export type CatalogueRow = {
  id: string;
  section: CatalogueSection;
  ordinal: number;
  heading: string;
  text: string;
  atoms: CatalogueAtom[];
};

export type PostgresTransitionCatalogue = {
  version: 1;
  source: {
    document: string;
    section: string;
  };
  rows: CatalogueRow[];
};

const EVIDENCE = new Set<CatalogueEvidence>([
  "transition",
  "diagnostic",
  "runtime-boundary",
]);

export function cataloguePath(scriptDirectory: string): string {
  return join(scriptDirectory, "postgres-transition-catalogue.json");
}

export function loadPostgresTransitionCatalogue(
  scriptDirectory: string,
): PostgresTransitionCatalogue {
  const path = cataloguePath(scriptDirectory);
  const parsed = JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  if (parsed["version"] !== 1) {
    throw new Error(`Unsupported catalogue version in ${path}.`);
  }
  const source = parsed["source"];
  if (
    typeof source !== "object" ||
    source === null ||
    Array.isArray(source) ||
    typeof (source as Record<string, unknown>)["document"] !== "string" ||
    typeof (source as Record<string, unknown>)["section"] !== "string"
  ) {
    throw new Error(`Invalid catalogue source in ${path}.`);
  }
  if (!Array.isArray(parsed["rows"]) || parsed["rows"].length === 0) {
    throw new Error(`Catalogue has no rows: ${path}.`);
  }
  const rows = parsed["rows"].map((row, index) => parseRow(row, index, path));
  return {
    version: 1,
    source: {
      document: (source as Record<string, unknown>)["document"] as string,
      section: (source as Record<string, unknown>)["section"] as string,
    },
    rows,
  };
}

function parseRow(value: unknown, index: number, path: string): CatalogueRow {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid catalogue row ${index} in ${path}.`);
  }
  const row = value as Record<string, unknown>;
  if (typeof row["id"] !== "string" || !/^PG-CAT-[A-Z]{3}-\d{2}$/.test(row["id"])) {
    throw new Error(`Invalid catalogue row id at ${index} in ${path}.`);
  }
  if (
    typeof row["section"] !== "string" ||
    !CATALOGUE_SECTIONS.includes(row["section"] as CatalogueSection)
  ) {
    throw new Error(`Invalid catalogue section at ${index} in ${path}.`);
  }
  if (
    typeof row["ordinal"] !== "number" ||
    !Number.isInteger(row["ordinal"]) ||
    row["ordinal"] < 1
  ) {
    throw new Error(`Invalid catalogue ordinal at ${index} in ${path}.`);
  }
  if (typeof row["heading"] !== "string" || row["heading"].trim().length === 0) {
    throw new Error(`Invalid catalogue heading at ${index} in ${path}.`);
  }
  if (typeof row["text"] !== "string" || row["text"].trim().length === 0) {
    throw new Error(`Invalid catalogue text at ${index} in ${path}.`);
  }
  const rowId = row["id"] as string;
  if (!Array.isArray(row["atoms"]) || row["atoms"].length === 0) {
    throw new Error(`Catalogue row ${rowId} has no atoms.`);
  }
  return {
    id: rowId,
    section: row["section"] as CatalogueSection,
    ordinal: row["ordinal"],
    heading: row["heading"].trim(),
    text: row["text"].trim(),
    atoms: row["atoms"].map((atom, atomIndex) =>
      parseAtom(atom, rowId, atomIndex, path),
    ),
  };
}

function parseAtom(
  value: unknown,
  rowId: string,
  index: number,
  path: string,
): CatalogueAtom {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid atom ${index} for ${rowId} in ${path}.`);
  }
  const atom = value as Record<string, unknown>;
  if (typeof atom["id"] !== "string" || !CATALOGUE_ATOM_PATTERN.test(atom["id"])) {
    throw new Error(`Invalid atom id ${String(atom["id"])} in ${path}.`);
  }
  if (!atom["id"].startsWith(`${rowId}::`)) {
    throw new Error(`Atom ${atom["id"]} is not prefixed with ${rowId}.`);
  }
  if (
    !Array.isArray(atom["verbs"]) ||
    atom["verbs"].length === 0 ||
    !atom["verbs"].every((entry) => typeof entry === "string" && entry.length > 0)
  ) {
    throw new Error(`Invalid verbs for ${atom["id"]}.`);
  }
  if (
    !Array.isArray(atom["objects"]) ||
    atom["objects"].length === 0 ||
    !atom["objects"].every((entry) => typeof entry === "string" && entry.length > 0)
  ) {
    throw new Error(`Invalid objects for ${atom["id"]}.`);
  }
  const facets = atom["facets"] === undefined ? [] : atom["facets"];
  if (
    !Array.isArray(facets) ||
    !facets.every((entry) => typeof entry === "string" && entry.startsWith("@"))
  ) {
    throw new Error(`Invalid facets for ${atom["id"]}.`);
  }
  if (
    !Array.isArray(atom["evidence"]) ||
    atom["evidence"].length === 0 ||
    !atom["evidence"].every(
      (entry) => typeof entry === "string" && EVIDENCE.has(entry as CatalogueEvidence),
    )
  ) {
    throw new Error(`Invalid evidence for ${atom["id"]}.`);
  }
  return {
    id: atom["id"],
    verbs: atom["verbs"] as string[],
    objects: atom["objects"] as string[],
    facets: facets as string[],
    evidence: [...new Set(atom["evidence"] as CatalogueEvidence[])],
  };
}

export function normalizeCatalogueText(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, " ").replace(/\s+/g, " ").trim();
}

export function parseCatalogueSection(markdown: string): {
  heading: string;
  checked: boolean;
  text: string;
}[] {
  const start = markdown.indexOf("## PostgreSQL transition catalogue");
  const end = markdown.indexOf("\n## Dependency and destructive-change matrix");
  if (start < 0 || end < 0 || end <= start) {
    throw new Error("Unable to locate the PostgreSQL transition catalogue section.");
  }
  const section = markdown.slice(start, end);
  const rows: { heading: string; checked: boolean; text: string }[] = [];
  let heading = "";
  let current: { heading: string; checked: boolean; text: string } | undefined;
  for (const line of section.split(/\r?\n/)) {
    const headingMatch = /^### (.+)$/.exec(line);
    if (headingMatch?.[1]) {
      heading = headingMatch[1].trim();
      continue;
    }
    const itemMatch = /^- \[([ x])\] (.+)$/.exec(line);
    if (itemMatch?.[1] && itemMatch[2]) {
      if (current) rows.push(current);
      current = {
        heading,
        checked: itemMatch[1] === "x",
        text: itemMatch[2],
      };
      continue;
    }
    if (current && line.startsWith("  ") && !line.startsWith("- ")) {
      const continuation = line.trim();
      if (continuation.startsWith("<!--") && continuation.endsWith("-->")) {
        continue;
      }
      current.text += ` ${continuation}`;
    }
  }
  if (current) rows.push(current);
  return rows;
}

export function evidenceForCaseKind(kind: string): CatalogueEvidence | undefined {
  if (kind === "coverage") return "runtime-boundary";
  if (kind === "expected-unsupported-transition") return "diagnostic";
  if (
    kind === "rename-ambiguity-transition" ||
    kind === "destructive-change-transition"
  ) {
    return "diagnostic";
  }
  if (
    kind === "applicable-transition" ||
    kind === "populated-column-transition" ||
    kind === "dependency-ordering-transition" ||
    kind === "grants-rls-preservation-transition" ||
    kind === "no-op-convergence-transition" ||
    kind === "deterministic-output-transition" ||
    kind === "recovery-after-failure-transition"
  ) {
    return "transition";
  }
  return undefined;
}
