# Case: 152-publication-row-filter

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.9s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.9s`
<!-- declarative-schema-command-result case="152-publication-row-filter" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `40.5s`
<!-- declarative-schema-command-result case="152-publication-row-filter" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `40.9s`
<!-- declarative-schema-command-result case="152-publication-row-filter" engine="next" command="sync-verification" status="OK" -->

