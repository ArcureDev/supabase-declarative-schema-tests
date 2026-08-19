# Case: 268-vault-secret-lifecycle

- Coverage: create, rotate, inspect, and delete a Vault secret without exposing plaintext
- Requirements: `V1`

## Stop any prior shared runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.7s`

## Start the isolated local runtime (service plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `33.9s`

## Reset runtime state (service plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.0s`

## Create the runtime Vault secret (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `1.1s`

## Resolve the local Data API (service plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Inspect redacted Vault metadata (service plane)

- Command: `POST http://127.0.0.1:54321/rest/v1/rpc/vault_probe_268`
- Result: **OK**
- Duration: `0.0s`

## Rotate the runtime secret (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Inspect metadata after rotation (service plane)

- Command: `POST http://127.0.0.1:54321/rest/v1/rpc/vault_probe_268`
- Result: **OK**
- Duration: `0.0s`

## Delete the runtime secret (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="268-vault-secret-lifecycle" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="268-vault-secret-lifecycle" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="268-vault-secret-lifecycle" engine="next" command="sync-verification" status="OK" -->

