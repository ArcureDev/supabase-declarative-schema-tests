# Case: 172-extension-version-and-cascade-options

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `24.3s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.8s`
<!-- declarative-schema-command-result case="172-extension-version-and-cascade-options" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `59.3s`
<!-- declarative-schema-command-result case="172-extension-version-and-cascade-options" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `59.3s`
<!-- declarative-schema-command-result case="172-extension-version-and-cascade-options" engine="next" command="sync-verification" status="OK" -->

