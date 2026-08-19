# Case: 99-domain-with-multiple-constraints

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `22.9s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.9s`
<!-- declarative-schema-command-result case="99-domain-with-multiple-constraints" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `97.2s`
<!-- declarative-schema-command-result case="99-domain-with-multiple-constraints" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `73.8s`
<!-- declarative-schema-command-result case="99-domain-with-multiple-constraints" engine="next" command="sync-verification" status="OK" -->

