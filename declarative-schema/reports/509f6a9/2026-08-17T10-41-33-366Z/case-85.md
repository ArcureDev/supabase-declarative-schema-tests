# Case: 85-procedure-with-transaction-safe-body

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.6s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.9s`
<!-- declarative-schema-command-result case="85-procedure-with-transaction-safe-body" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `50.4s`
<!-- declarative-schema-command-result case="85-procedure-with-transaction-safe-body" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `52.5s`
<!-- declarative-schema-command-result case="85-procedure-with-transaction-safe-body" engine="next" command="sync-verification" status="OK" -->

