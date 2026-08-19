# Case: 267-edge-function-version-behavior

- Coverage: exercise deterministic default and requested versions in a local Edge Function
- Requirements: `E4`

## Stop any prior shared runtime (functions plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.9s`

## Start the isolated local runtime (functions plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `33.5s`

## Reset runtime state (functions plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `30.9s`

## Record the expected function contract (functions plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Resolve the local Functions gateway (functions plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Request the default function version (functions plane)

- Command: `GET http://127.0.0.1:54321/functions/v1/version-boundary-267`
- Result: **OK**
- Duration: `0.1s`

## Request the explicit v2 behavior (functions plane)

- Command: `GET http://127.0.0.1:54321/functions/v1/version-boundary-267`
- Result: **OK**
- Duration: `0.0s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="267-edge-function-version-behavior" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="267-edge-function-version-behavior" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="267-edge-function-version-behavior" engine="next" command="sync-verification" status="OK" -->

