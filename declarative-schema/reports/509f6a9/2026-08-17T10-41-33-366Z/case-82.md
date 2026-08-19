# Case: 82-function-volatility-and-parallel-safety

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `23.6s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `1.0s`
<!-- declarative-schema-command-result case="82-function-volatility-and-parallel-safety" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `59.9s`
<!-- declarative-schema-command-result case="82-function-volatility-and-parallel-safety" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `58.8s`
<!-- declarative-schema-command-result case="82-function-volatility-and-parallel-safety" engine="next" command="sync-verification" status="OK" -->

