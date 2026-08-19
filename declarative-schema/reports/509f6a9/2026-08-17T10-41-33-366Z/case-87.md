# Case: 87-after-row-trigger-with-arguments

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `24.7s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.9s`
<!-- declarative-schema-command-result case="87-after-row-trigger-with-arguments" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `51.8s`
<!-- declarative-schema-command-result case="87-after-row-trigger-with-arguments" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `53.3s`
<!-- declarative-schema-command-result case="87-after-row-trigger-with-arguments" engine="next" command="sync-verification" status="OK" -->

