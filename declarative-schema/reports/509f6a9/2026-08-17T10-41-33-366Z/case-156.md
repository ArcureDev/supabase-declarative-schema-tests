# Case: 156-logical-replication-slot-metadata-boundary

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `22.0s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `1.2s`
<!-- declarative-schema-command-result case="156-logical-replication-slot-metadata-boundary" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `40.6s`
<!-- declarative-schema-command-result case="156-logical-replication-slot-metadata-boundary" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `43.3s`
<!-- declarative-schema-command-result case="156-logical-replication-slot-metadata-boundary" engine="next" command="sync-verification" status="OK" -->

