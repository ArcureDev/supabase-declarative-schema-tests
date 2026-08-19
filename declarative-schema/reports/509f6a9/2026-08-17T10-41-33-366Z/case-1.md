# Case: 01-basic-table

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --reset --overwrite --debug`
- Result: **OK**
- Duration: `30.0s`
<!-- declarative-schema-command-result case="01-basic-table" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `59.7s`
<!-- declarative-schema-command-result case="01-basic-table" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `41.0s`
<!-- declarative-schema-command-result case="01-basic-table" engine="next" command="sync-verification" status="OK" -->

