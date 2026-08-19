# Case: 271-cron-queue-webhook-pipeline

- Coverage: exercise a local Cron to pgmq to pg_net webhook pipeline without external traffic
- Requirements: `V4`

## Stop any prior shared runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.6s`

## Start the isolated local runtime (service plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `33.2s`

## Reset runtime state (service plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.4s`

## Create the cross-feature runtime pipeline (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `1.2s`

## Resolve the local Data API (service plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Invoke the pipeline through a service-only RPC (service plane)

- Command: `POST http://127.0.0.1:54321/rest/v1/rpc/pipeline_dispatch_271`
- Result: **OK**
- Duration: `0.0s`

## Verify all pipeline boundaries (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Remove runtime schedule and queue state (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="271-cron-queue-webhook-pipeline" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="271-cron-queue-webhook-pipeline" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="271-cron-queue-webhook-pipeline" engine="next" command="sync-verification" status="OK" -->

