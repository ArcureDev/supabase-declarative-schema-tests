# Case: 287-local-reset-idempotence

- Coverage: Reset a mutated local database twice and assert each reset restores exactly the migration-defined baseline.
- Requirements: `C3`

## Stop prior local runtime (config plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `13.1s`

## Start fixture local runtime (config plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `34.9s`

## Apply first local reset (config plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.9s`

## Assert first reset baseline (config plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Add disposable runtime data (config plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Apply second local reset (config plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.9s`

## Assert second reset baseline (config plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Apply third local reset (config plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.2s`

## Assert third reset baseline (config plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="287-local-reset-idempotence" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="287-local-reset-idempotence" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="287-local-reset-idempotence" engine="next" command="sync-verification" status="OK" -->

