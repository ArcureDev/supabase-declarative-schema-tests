# Case: 265-url-config-stability

- Coverage: hold local API URL configuration stable across status and Data API phases
- Requirements: `E3`

## Stop any prior shared runtime (config plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `13.4s`

## Start the isolated local runtime (config plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `44.3s`

## Reset runtime state (config plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.1s`

## Create a config-visible Data API probe (config plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `1.1s`

## Capture configured local URLs (config plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Read through the configured API URL (config plane)

- Command: `GET http://127.0.0.1:54321/rest/v1/config_probe_265`
- Result: **OK**
- Duration: `0.0s`

## Confirm URL output remains stable (config plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="265-url-config-stability" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="265-url-config-stability" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="265-url-config-stability" engine="next" command="sync-verification" status="OK" -->

