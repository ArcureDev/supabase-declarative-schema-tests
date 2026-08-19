# Case: 31-self-referencing-foreign-key

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `22.6s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `1.0s`
<!-- declarative-schema-command-result case="31-self-referencing-foreign-key" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `41.8s`
<!-- declarative-schema-command-result case="31-self-referencing-foreign-key" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `41.9s`
<!-- declarative-schema-command-result case="31-self-referencing-foreign-key" engine="next" command="sync-verification" status="OK" -->

