# Case: 281-postgrest-data-api-exposure

- Coverage: verify configured Data API schema exposure, RLS, views, computed fields, and RPC behavior
- Requirements: `X6`

## Stop any prior shared runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.9s`

## Start the configured Data API runtime (service plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `33.5s`

## Reset the Data API exposure fixture (service plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.2s`

## Populate runtime API and private data (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Verify exposed catalog data and ACLs (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Resolve local runtime credentials (service plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Require RLS-filtered table exposure (service plane)

- Command: `GET http://127.0.0.1:54321/rest/v1/exposure_items_281`
- Result: **OK**
- Duration: `0.0s`

## Require security-invoker view exposure (service plane)

- Command: `GET http://127.0.0.1:54321/rest/v1/exposure_view_281`
- Result: **OK**
- Duration: `0.0s`

## Require invoker-safe RPC exposure (service plane)

- Command: `POST http://127.0.0.1:54321/rest/v1/rpc/exposure_summary_281`
- Result: **OK**
- Duration: `0.0s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="281-postgrest-data-api-exposure" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="281-postgrest-data-api-exposure" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="281-postgrest-data-api-exposure" engine="next" command="sync-verification" status="OK" -->

