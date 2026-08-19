# Case: 49-alter-table-set-and-drop-default

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.4s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.8s`
<!-- declarative-schema-command-result case="49-alter-table-set-and-drop-default" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `59.1s`
<!-- declarative-schema-command-result case="49-alter-table-set-and-drop-default" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `59.2s`
<!-- declarative-schema-command-result case="49-alter-table-set-and-drop-default" engine="next" command="sync-verification" status="OK" -->

