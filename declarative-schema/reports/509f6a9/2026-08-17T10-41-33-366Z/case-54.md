# Case: 54-index-sort-order-and-null-placement

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.3s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.8s`
<!-- declarative-schema-command-result case="54-index-sort-order-and-null-placement" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `59.4s`
<!-- declarative-schema-command-result case="54-index-sort-order-and-null-placement" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `59.0s`
<!-- declarative-schema-command-result case="54-index-sort-order-and-null-placement" engine="next" command="sync-verification" status="OK" -->

