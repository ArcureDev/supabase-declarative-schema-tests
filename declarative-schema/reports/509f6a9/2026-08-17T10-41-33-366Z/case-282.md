# Case: 282-api-schema-exposure-config

- Coverage: Validate that config.toml exposes an explicitly granted custom API schema and that anon can read it.
- Requirements: `C1`

## Stop prior local runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.7s`

## Start fixture local runtime (service plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `34.6s`

## Reset API exposure fixture (service plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `33.4s`

## Assert exposed schema catalog state (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Capture local service endpoints (service plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Read configured custom API schema (service plane)

- Command: `GET http://127.0.0.1:54321/rest/v1/exposed_items`
- Result: **OK**
- Duration: `0.0s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="282-api-schema-exposure-config" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="282-api-schema-exposure-config" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="282-api-schema-exposure-config" engine="next" command="sync-verification" status="OK" -->

