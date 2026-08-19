# Case: 296-offline-diagnostics

- Coverage: Capture local CLI evidence, then connect to the reserved closed loopback port and require a fast, explicit offline diagnostic.
- Requirements: `C5`

## Capture offline CLI evidence (config plane)

- Command: `npx supabase --version`
- Result: **OK**
- Duration: `0.7s`

## Capture unreachable database diagnostic (config plane)

- Command: `npx supabase db schema declarative generate --db-url [REDACTED_DATABASE_URL] --output ./offline-output --overwrite --debug`
- Result: **ERROR**
- Duration: `0.4s`
- Exit code: `1`

```text
Invalid value for flag --output: "./offline-output". Expected: "env" | "pretty" | "json" | "toml" | "yaml" | "table" | "csv"
Assertion failed: output did not match required /ECONNREFUSED|connection refused|dial error/i
```

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **ERROR**
- Duration: `0.0s`
- Exit code: `1`

```text
(no output)
```
<!-- declarative-schema-command-result case="296-offline-diagnostics" engine="next" command="generate" status="ERROR" -->
<!-- declarative-schema-command-result case="296-offline-diagnostics" engine="next" command="sync" status="ERROR" -->
<!-- declarative-schema-command-result case="296-offline-diagnostics" engine="next" command="sync-verification" status="ERROR" -->

