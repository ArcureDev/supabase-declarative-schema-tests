import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  evidenceForCaseKind,
  loadPostgresTransitionCatalogue,
  normalizeCatalogueText,
  parseCatalogueSection,
} from "./catalogue.mts";
import { loadRunnerConfig } from "./config.mts";
import { discoverCases } from "./files.mts";

const scriptDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function coveringEvidence(
  kind: string,
): "transition" | "diagnostic" | "runtime-boundary" | undefined {
  return evidenceForCaseKind(kind);
}

test("PostgreSQL transition catalogue is complete, unique, and fully evidenced", () => {
  const catalogue = loadPostgresTransitionCatalogue(scriptDirectory);
  assert.equal(catalogue.rows.length, 72);
  const matrix = parseCatalogueSection(
    readFileSync(resolve(scriptDirectory, "TEST-MATRIX.md"), "utf8"),
  );
  assert.equal(matrix.length, 72);

  const rowIds = new Set<string>();
  const atomIds = new Set<string>();
  for (const [index, row] of catalogue.rows.entries()) {
    assert.equal(rowIds.has(row.id), false, `duplicate row ${row.id}`);
    rowIds.add(row.id);
    const matrixRow = matrix[index];
    assert.ok(matrixRow, `missing TEST-MATRIX row for ${row.id}`);
    assert.equal(row.heading, matrixRow.heading, row.id);
    assert.equal(
      normalizeCatalogueText(row.text),
      normalizeCatalogueText(matrixRow.text),
      row.id,
    );
    for (const atom of row.atoms) {
      assert.equal(atomIds.has(atom.id), false, `duplicate atom ${atom.id}`);
      atomIds.add(atom.id);
    }
  }

  const cases = discoverCases(loadRunnerConfig(scriptDirectory, []));
  const coverage = new Map<
    string,
    { name: string; evidence: "transition" | "diagnostic" | "runtime-boundary" }[]
  >();
  for (const fixture of cases) {
    const atoms =
      "catalogueAtoms" in fixture ? fixture.catalogueAtoms : [];
    const evidence = coveringEvidence(fixture.kind);
    for (const atom of atoms) {
      assert.ok(atomIds.has(atom), `${fixture.name} references unknown atom ${atom}`);
      if (!evidence) continue;
      const holders = coverage.get(atom) ?? [];
      holders.push({ name: fixture.name, evidence });
      coverage.set(atom, holders);
    }
  }

  const uncovered: string[] = [];
  const mismatched: string[] = [];
  for (const row of catalogue.rows) {
    let rowCovered = true;
    for (const atom of row.atoms) {
      const holders = coverage.get(atom.id) ?? [];
      const matching = holders.filter((holder) =>
        atom.evidence.includes(holder.evidence),
      );
      if (matching.length === 0) {
        rowCovered = false;
        if (holders.length === 0) uncovered.push(atom.id);
        else mismatched.push(atom.id);
      }
    }
    assert.equal(
      matrix[catalogue.rows.indexOf(row)]?.checked,
      rowCovered,
      `${row.id} checkbox must match complete atom coverage`,
    );
  }
  assert.deepEqual(uncovered, [], "every catalogue atom needs executable evidence");
  assert.deepEqual(
    mismatched,
    [],
    "catalogue evidence types must match the covering fixture kind",
  );
});
