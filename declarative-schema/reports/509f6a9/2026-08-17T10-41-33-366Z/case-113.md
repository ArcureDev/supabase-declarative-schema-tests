# Case: 113-sequence-ownership-by-table-column

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `22.6s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.9s`
<!-- declarative-schema-command-result case="113-sequence-ownership-by-table-column" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `41.0s`
<!-- declarative-schema-command-result case="113-sequence-ownership-by-table-column" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `40.4s`
<!-- declarative-schema-command-result case="113-sequence-ownership-by-table-column" engine="next" command="sync-verification" status="OK" -->

