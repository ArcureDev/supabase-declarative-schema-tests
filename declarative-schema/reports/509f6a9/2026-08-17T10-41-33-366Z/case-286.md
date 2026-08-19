# Case: 286-conflicting-definitions-diagnostic

- Coverage: Intentionally plan conflicting duplicate table definitions and require a stable nonzero parser diagnostic.
- Requirements: `C2`, `C5`

## Stop prior local runtime (config plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `13.1s`

## Start fixture local runtime (config plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `34.4s`

## Reset conflict diagnostic fixture (config plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.9s`

## Capture duplicate definition diagnostic (config plane)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `39.2s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="286-conflicting-definitions-diagnostic" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="286-conflicting-definitions-diagnostic" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="286-conflicting-definitions-diagnostic" engine="next" command="sync-verification" status="OK" -->

