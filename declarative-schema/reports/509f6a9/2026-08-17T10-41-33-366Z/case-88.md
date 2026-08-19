# Case: 88-constraint-trigger

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `24.5s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `1.1s`
<!-- declarative-schema-command-result case="88-constraint-trigger" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `63.2s`
<!-- declarative-schema-command-result case="88-constraint-trigger" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `63.8s`
<!-- declarative-schema-command-result case="88-constraint-trigger" engine="next" command="sync-verification" status="OK" -->

