# Case: 159-replica-identity-nothing

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `22.2s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `1.1s`
<!-- declarative-schema-command-result case="159-replica-identity-nothing" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `49.9s`
<!-- declarative-schema-command-result case="159-replica-identity-nothing" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `59.7s`
<!-- declarative-schema-command-result case="159-replica-identity-nothing" engine="next" command="sync-verification" status="OK" -->

