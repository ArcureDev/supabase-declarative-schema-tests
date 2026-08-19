# Case: 125-schema-usage-and-create-grants

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.8s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.8s`
<!-- declarative-schema-command-result case="125-schema-usage-and-create-grants" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `40.0s`
<!-- declarative-schema-command-result case="125-schema-usage-and-create-grants" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `43.2s`
<!-- declarative-schema-command-result case="125-schema-usage-and-create-grants" engine="next" command="sync-verification" status="OK" -->

