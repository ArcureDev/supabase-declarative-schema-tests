import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  failedCaseNumbersFromReport,
  parseCaseSelection,
} from "./selection.mts";

test("parseCaseSelection handles lists, ranges, failed, and invalid input", () => {
  const selection = parseCaseSelection(["--case=2,4-6"]);
  assert.equal(selection.kind, "numbers");
  if (selection.kind === "numbers") {
    assert.deepEqual([...selection.caseNumbers], [2, 4, 5, 6]);
  }
  assert.deepEqual(parseCaseSelection(["--failed"]), { kind: "latest-failures" });
  assert.deepEqual(parseCaseSelection([]), { kind: "all" });
  assert.throws(() => parseCaseSelection(["--case"]), /Missing case selection/);
  assert.throws(() => parseCaseSelection(["--case=3-2"]), /ascending order/);
  assert.throws(() => parseCaseSelection(["--case=1", "--failed"]), /either --case or --failed/);
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
