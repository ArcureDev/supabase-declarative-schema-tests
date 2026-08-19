# Case: 269-cron-runtime-diagnostic

- Coverage: schedule and diagnose a pg_cron job as runtime-only state
- Requirements: `V2`

## Stop any prior shared runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.8s`

## Start the isolated local runtime (service plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `35.5s`

## Reset runtime state (service plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.6s`

## Create the runtime-only Cron schedule (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `1.1s`

## Resolve the local Data API (service plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Read the service-only Cron diagnostic (service plane)

- Command: `POST http://127.0.0.1:54321/rest/v1/rpc/cron_diagnostic_269`
- Result: **OK**
- Duration: `0.0s`

## Remove runtime-only Cron state (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="269-cron-runtime-diagnostic" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="269-cron-runtime-diagnostic" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="269-cron-runtime-diagnostic" engine="next" command="sync-verification" status="OK" -->

