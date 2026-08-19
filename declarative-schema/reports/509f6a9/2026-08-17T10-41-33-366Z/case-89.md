# Case: 89-instead-of-view-trigger

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `25.5s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.8s`
<!-- declarative-schema-command-result case="89-instead-of-view-trigger" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `62.8s`
<!-- declarative-schema-command-result case="89-instead-of-view-trigger" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `63.1s`
<!-- declarative-schema-command-result case="89-instead-of-view-trigger" engine="next" command="sync-verification" status="OK" -->

