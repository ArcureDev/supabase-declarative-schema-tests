# Case: 64-index-tablespace

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.3s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.8s`
<!-- declarative-schema-command-result case="64-index-tablespace" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `49.9s`
<!-- declarative-schema-command-result case="64-index-tablespace" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `50.4s`
<!-- declarative-schema-command-result case="64-index-tablespace" engine="next" command="sync-verification" status="OK" -->

