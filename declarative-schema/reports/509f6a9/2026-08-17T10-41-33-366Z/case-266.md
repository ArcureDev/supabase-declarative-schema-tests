# Case: 266-edge-function-jwt-verification

- Coverage: enforce JWT verification before invoking an actual local Edge Function
- Requirements: `E4`

## Stop any prior shared runtime (functions plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.7s`

## Start the isolated local runtime (functions plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `33.5s`

## Reset runtime state (functions plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.2s`

## Verify function runtime database context (functions plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Resolve the local Functions gateway (functions plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Reject a request without a JWT (functions plane)

- Command: `POST http://127.0.0.1:54321/functions/v1/jwt-boundary-266`
- Result: **OK**
- Duration: `0.0s`

## Allow a valid local anon JWT (functions plane)

- Command: `POST http://127.0.0.1:54321/functions/v1/jwt-boundary-266`
- Result: **OK**
- Duration: `0.2s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="266-edge-function-jwt-verification" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="266-edge-function-jwt-verification" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="266-edge-function-jwt-verification" engine="next" command="sync-verification" status="OK" -->

