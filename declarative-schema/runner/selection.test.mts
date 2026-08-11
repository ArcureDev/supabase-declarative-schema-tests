import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  failedCaseNumbersFromReport,
  latestVersionPath,
  notOkCaseNumbersFromVersion,
  parseCaseSelection,
} from "./selection.mts";

test("parseCaseSelection handles lists, ranges, status filters, and invalid input", () => {
  const selection = parseCaseSelection(["--case=2,4-6"]);
  assert.equal(selection.kind, "numbers");
  if (selection.kind === "numbers") {
    assert.deepEqual([...selection.caseNumbers], [2, 4, 5, 6]);
  }
  assert.deepEqual(parseCaseSelection(["--failed"]), { kind: "latest-failures" });
  assert.deepEqual(parseCaseSelection(["--not-ok"]), { kind: "latest-not-ok" });
  assert.deepEqual(parseCaseSelection([]), { kind: "all" });
  assert.throws(() => parseCaseSelection(["--case"]), /Missing case selection/);
  assert.throws(() => parseCaseSelection(["--case=3-2"]), /ascending order/);
  assert.throws(() => parseCaseSelection(["--case=1", "--failed"]), /Use only one/);
  assert.throws(() => parseCaseSelection(["--failed", "--not-ok"]), /Use only one/);
  assert.throws(() => parseCaseSelection(["--not-ok=true"]), /does not accept a value/);
});

test("failedCaseNumbersFromReport supports marker and legacy reports", () => {
  const directory = mkdtempSync(join(tmpdir(), "ds-runner-selection-"));
  try {
    const markerReport = join(directory, "marker.md");
    writeFileSync(
      markerReport,
      [
        '<!-- declarative-schema-case-result name="1-ok" status="OK" -->',
        '<!-- declarative-schema-case-result name="181-failed" status="FAILED" -->',
      ].join("\n"),
    );
    assert.deepEqual([...failedCaseNumbersFromReport(markerReport)], [181]);

    const legacyReport = join(directory, "legacy.md");
    writeFileSync(
      legacyReport,
      ["## 2-ok", "- Result: **OK**", "## 3-warning", "- Result: **WARNING**"].join("\n"),
    );
    assert.deepEqual([...failedCaseNumbersFromReport(legacyReport)], [3]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("notOkCaseNumbersFromVersion prioritizes incomplete and absent cases", () => {
  const directory = mkdtempSync(join(tmpdir(), "ds-runner-selection-"));
  try {
    const versionFile = join(directory, "version-abcdef0.md");
    const row = (
      caseName: string,
      command: string,
      nextStatus: string,
      legacyStatus: string,
    ): string =>
      `| \`${caseName}\` | ${command} | **${nextStatus}** | **${legacyStatus}** | [\`report.md\`](../reports/report.md) |`;
    writeFileSync(
      versionFile,
      [
        "# Supabase CLI version abcdef0",
        "",
        "- Supabase CLI version: `1.2.3`",
        "- Checksum: `abcdef0`",
        row("1-ok", "generate", "OK", "—"),
        row("1-ok", "sync", "OK", "—"),
        row("1-ok", "sync-verification", "OK", "—"),
        row("2-not-run", "generate", "—", "—"),
        row("2-not-run", "sync", "OK", "—"),
        row("2-not-run", "sync-verification", "OK", "—"),
        row("3-warning", "generate", "WARNING", "OK"),
        row("3-warning", "sync", "OK", "—"),
        row("3-warning", "sync-verification", "OK", "—"),
        row("4-error", "generate", "OK", "—"),
        row("4-error", "sync", "ERROR", "—"),
        row("4-error", "sync-verification", "OK", "—"),
        row("5-incomplete", "generate", "OK", "—"),
        row("5-incomplete", "sync", "OK", "—"),
      ].join("\n"),
    );

    assert.equal(latestVersionPath(directory, "abcdef0"), versionFile);
    assert.deepEqual(
      [
        ...notOkCaseNumbersFromVersion(versionFile, "1.2.3", "abcdef0", [
          "1-ok",
          "2-not-run",
          "3-warning",
          "4-error",
          "5-incomplete",
          "6-absent",
        ]),
      ],
      [2, 5, 6, 4, 3],
    );
    assert.throws(
      () => notOkCaseNumbersFromVersion(versionFile, "1.2.4", "abcdef0", ["1-ok"]),
      /current CLI is version 1\.2\.4/,
    );
    assert.throws(
      () => notOkCaseNumbersFromVersion(versionFile, "1.2.3", "1234567", ["1-ok"]),
      /current CLI is version 1\.2\.3 with checksum 1234567/,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
