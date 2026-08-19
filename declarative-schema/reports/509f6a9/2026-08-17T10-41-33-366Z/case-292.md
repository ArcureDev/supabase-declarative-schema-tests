# Case: 292-migration-repair-squash

- Coverage: Repair one local migration-history entry, restore it, squash the local chain, and verify application catalog state remains intact.
- Requirements: `C3`

## Stop prior local runtime (config plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `13.3s`

## Start fixture local runtime (config plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `34.7s`

## Apply migration chain (config plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `33.8s`

## Mark latest migration reverted (config plane)

- Command: `npx supabase migration repair 20260101000001 --status reverted --local --debug`
- Result: **OK**
- Duration: `0.5s`

## Restore latest migration history (config plane)

- Command: `npx supabase migration repair 20260101000001 --status applied --local --debug`
- Result: **OK**
- Duration: `0.5s`

## Squash repaired migration chain (config plane)

- Command: `npx supabase migration squash --local --version 20260101000001 --yes --debug`
- Result: **OK**
- Duration: `21.8s`

## Assert catalog after repair and squash (config plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="292-migration-repair-squash" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="292-migration-repair-squash" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="292-migration-repair-squash" engine="next" command="sync-verification" status="OK" -->

