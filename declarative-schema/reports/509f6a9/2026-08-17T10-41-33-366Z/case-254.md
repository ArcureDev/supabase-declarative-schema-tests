# Case: 254-auth-data-boundary-local-service

- Coverage: create email and anonymous Auth records through local HTTP behavior and assert provider state remains service data
- Requirements: `A5`

## Stop the prior configured runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.7s`

## Start local Auth with anonymous sign-in (service plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `33.1s`

## Reset Auth service data (service plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.2s`

## Create an application boundary anchor (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Resolve local Auth endpoint and keys (service plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Create an email identity through Auth (service plane)

- Command: `POST http://127.0.0.1:54321/auth/v1/signup`
- Result: **OK**
- Duration: `0.1s`

## Create an anonymous Auth identity (service plane)

- Command: `POST http://127.0.0.1:54321/auth/v1/signup`
- Result: **OK**
- Duration: `0.0s`

## Assert Auth records and provider boundary (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="254-auth-data-boundary-local-service" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="254-auth-data-boundary-local-service" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="254-auth-data-boundary-local-service" engine="next" command="sync-verification" status="OK" -->

