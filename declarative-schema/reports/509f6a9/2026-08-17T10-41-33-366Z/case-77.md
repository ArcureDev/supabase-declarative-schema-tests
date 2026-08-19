# Case: 77-function-returning-table

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `23.5s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.9s`
<!-- declarative-schema-command-result case="77-function-returning-table" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `75.8s`
<!-- declarative-schema-command-result case="77-function-returning-table" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `61.9s`
<!-- declarative-schema-command-result case="77-function-returning-table" engine="next" command="sync-verification" status="OK" -->

