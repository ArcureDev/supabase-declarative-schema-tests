# Case: 110-transform-for-a-procedural-language

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `23.9s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.9s`
<!-- declarative-schema-command-result case="110-transform-for-a-procedural-language" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `51.2s`
<!-- declarative-schema-command-result case="110-transform-for-a-procedural-language" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `41.5s`
<!-- declarative-schema-command-result case="110-transform-for-a-procedural-language" engine="next" command="sync-verification" status="OK" -->

