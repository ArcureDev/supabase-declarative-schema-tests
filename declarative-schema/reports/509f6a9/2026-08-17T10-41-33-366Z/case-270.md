# Case: 270-pgmq-queue-lifecycle

- Coverage: exercise pgmq create, send, read, archive, and drop lifecycle boundaries
- Requirements: `V3`

## Stop any prior shared runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.8s`

## Start the isolated local runtime (service plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `33.0s`

## Reset runtime state (service plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.2s`

## Create a runtime-only queue (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `1.1s`

## Resolve the local Data API (service plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Enqueue through a service-only RPC (service plane)

- Command: `POST http://127.0.0.1:54321/rest/v1/rpc/queue_enqueue_270`
- Result: **OK**
- Duration: `0.0s`

## Read and archive the queued message (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Inspect queue lifecycle counts (service plane)

- Command: `POST http://127.0.0.1:54321/rest/v1/rpc/queue_status_270`
- Result: **OK**
- Duration: `0.0s`

## Drop the runtime queue (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="270-pgmq-queue-lifecycle" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="270-pgmq-queue-lifecycle" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="270-pgmq-queue-lifecycle" engine="next" command="sync-verification" status="OK" -->

