# Case: 32-multi-column-foreign-key

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `22.4s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.9s`
<!-- declarative-schema-command-result case="32-multi-column-foreign-key" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `41.1s`
<!-- declarative-schema-command-result case="32-multi-column-foreign-key" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `50.6s`
<!-- declarative-schema-command-result case="32-multi-column-foreign-key" engine="next" command="sync-verification" status="OK" -->

