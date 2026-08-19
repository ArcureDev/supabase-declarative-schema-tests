# Case: 251-auth-hook-suite

- Coverage: exercise configured Postgres Auth hooks with exact grants, direct contracts, and local signup/sign-in behavior
- Requirements: `A2`

## Stop the shared runtime before hook configuration (config plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.8s`

## Start Auth with hook configuration (config plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `34.2s`

## Reset hook database state (config plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.9s`

## Install hardened Auth hook functions (config plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Resolve local Auth endpoint and keys (config plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Assert hook return values and privileges (config plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Issue a token through the configured access hook (config plane)

- Command: `POST http://127.0.0.1:54321/auth/v1/signup`
- Result: **OK**
- Duration: `0.2s`

## Run the password verification hook (config plane)

- Command: `POST http://127.0.0.1:54321/auth/v1/token`
- Result: **OK**
- Duration: `0.1s`

## Verify Auth invoked configured database hooks (config plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="251-auth-hook-suite" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="251-auth-hook-suite" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="251-auth-hook-suite" engine="next" command="sync-verification" status="OK" -->

