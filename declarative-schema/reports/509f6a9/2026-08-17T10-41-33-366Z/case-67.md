# Case: 67-renamed-index

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `23.8s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `1.0s`
<!-- declarative-schema-command-result case="67-renamed-index" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `62.1s`
<!-- declarative-schema-command-result case="67-renamed-index" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `42.1s`
<!-- declarative-schema-command-result case="67-renamed-index" engine="next" command="sync-verification" status="OK" -->

