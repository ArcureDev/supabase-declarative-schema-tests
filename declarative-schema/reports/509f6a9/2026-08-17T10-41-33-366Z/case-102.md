# Case: 102-array-use-of-a-custom-type

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.7s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.8s`
<!-- declarative-schema-command-result case="102-array-use-of-a-custom-type" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `50.0s`
<!-- declarative-schema-command-result case="102-array-use-of-a-custom-type" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `41.0s`
<!-- declarative-schema-command-result case="102-array-use-of-a-custom-type" engine="next" command="sync-verification" status="OK" -->

