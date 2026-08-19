# Case: 279-unavailable-remote-diagnostic

- Coverage: surface a deterministic unavailable-remote HTTP diagnostic without making a network request
- Requirements: `X4`
- Catalogue atoms: `PG-CAT-EXT-05::fdw.unavailable`

## Stop any prior shared runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.7s`

## Start the isolated local API runtime (service plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `33.4s`

## Reset the unavailable-remote fixture (service plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.8s`

## Install the no-network diagnostic fixture (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `1.1s`

## Verify diagnostic ACL and runtime data (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Resolve local runtime credentials (service plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Require the stable unavailable diagnostic (service plane)

- Command: `POST http://127.0.0.1:54321/rest/v1/rpc/probe_remote_279`
- Result: **OK**
- Duration: `0.0s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="279-unavailable-remote-diagnostic" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="279-unavailable-remote-diagnostic" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="279-unavailable-remote-diagnostic" engine="next" command="sync-verification" status="OK" -->

