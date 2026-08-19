# Case: 97-enum-value-added-with-alter-type

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.8s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `1.0s`
<!-- declarative-schema-command-result case="97-enum-value-added-with-alter-type" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `64.2s`
<!-- declarative-schema-command-result case="97-enum-value-added-with-alter-type" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `50.7s`
<!-- declarative-schema-command-result case="97-enum-value-added-with-alter-type" engine="next" command="sync-verification" status="OK" -->

