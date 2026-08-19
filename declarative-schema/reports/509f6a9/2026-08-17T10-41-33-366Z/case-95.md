# Case: 95-event-trigger-on-sql-drop

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `22.1s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `1.0s`
<!-- declarative-schema-command-result case="95-event-trigger-on-sql-drop" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `50.7s`
<!-- declarative-schema-command-result case="95-event-trigger-on-sql-drop" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `50.0s`
<!-- declarative-schema-command-result case="95-event-trigger-on-sql-drop" engine="next" command="sync-verification" status="OK" -->

