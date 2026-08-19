# Case: 94-event-trigger-on-ddl-command-end

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `20.6s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.8s`
<!-- declarative-schema-command-result case="94-event-trigger-on-ddl-command-end" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `59.7s`
<!-- declarative-schema-command-result case="94-event-trigger-on-ddl-command-end" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `50.6s`
<!-- declarative-schema-command-result case="94-event-trigger-on-ddl-command-end" engine="next" command="sync-verification" status="OK" -->

