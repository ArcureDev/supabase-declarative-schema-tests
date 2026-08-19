# Case: 134-restrictive-select-policy

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.8s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.9s`
<!-- declarative-schema-command-result case="134-restrictive-select-policy" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `39.7s`
<!-- declarative-schema-command-result case="134-restrictive-select-policy" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `40.0s`
<!-- declarative-schema-command-result case="134-restrictive-select-policy" engine="next" command="sync-verification" status="OK" -->

