# Case: 168-icu-collation

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.3s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.8s`
<!-- declarative-schema-command-result case="168-icu-collation" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `39.9s`
<!-- declarative-schema-command-result case="168-icu-collation" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `40.0s`
<!-- declarative-schema-command-result case="168-icu-collation" engine="next" command="sync-verification" status="OK" -->

