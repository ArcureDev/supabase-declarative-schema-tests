# Case: 290-seed-idempotence

- Coverage: Run configured seed SQL through repeated local resets and assert reference data converges to one deterministic row.
- Requirements: `C3`

## Stop prior local runtime (config plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `13.1s`

## Start fixture local runtime (config plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `34.6s`

## Reset and seed local database (config plane)

- Command: `npx supabase db reset --local --debug`
- Result: **OK**
- Duration: `33.6s`

## Assert first seed result (config plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Repeat reset and seed (config plane)

- Command: `npx supabase db reset --local --debug`
- Result: **OK**
- Duration: `32.8s`

## Assert repeated seed result (config plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="290-seed-idempotence" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="290-seed-idempotence" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="290-seed-idempotence" engine="next" command="sync-verification" status="OK" -->

