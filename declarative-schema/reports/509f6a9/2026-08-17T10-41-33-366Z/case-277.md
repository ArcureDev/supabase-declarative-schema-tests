# Case: 277-postgrest-schema-cache-behavior

- Coverage: verify explicit schema-cache reload behavior through PostgREST and pg_graphql
- Requirements: `X3`

## Stop any prior shared runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `12.9s`

## Start the local Data API runtime (service plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `33.1s`

## Reset the schema-cache fixture (service plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `30.9s`

## Create the initial cached API shape (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `1.1s`

## Resolve local runtime credentials (service plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Read the initial cached relation (service plane)

- Command: `GET http://127.0.0.1:54321/rest/v1/cache_items_277`
- Result: **OK**
- Duration: `0.0s`

## Read the initial pg_graphql relation shape (service plane)

- Command: `POST http://127.0.0.1:54321/graphql/v1`
- Result: **ERROR**
- Duration: `0.0s`
- Exit code: `1`

```text
HTTP 406
{"code":"PGRST106","details":null,"hint":"Only the following schemas are exposed: public","message":"Invalid schema: graphql_public"}
Assertion failed: expected status 200, received 406
Assertion failed: response body did not match /"label":"cache-row-277"/i
Assertion failed: status ERROR was not one of OK
```

## Add a column and request cache reload (service plane)

- Command: `phase:mutate`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): initial-graphql.
```

## Verify catalog data and ACL state (service plane)

- Command: `phase:verify-catalog`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): mutate.
```

## Read the reloaded PostgREST shape (service plane)

- Command: `phase:refreshed-read`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): verify-catalog.
```

## Read the reloaded pg_graphql relation shape (service plane)

- Command: `phase:refreshed-graphql`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): refreshed-read.
```

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **ERROR**
- Duration: `0.0s`
- Exit code: `1`

```text
(no output)
```
<!-- declarative-schema-command-result case="277-postgrest-schema-cache-behavior" engine="next" command="generate" status="ERROR" -->
<!-- declarative-schema-command-result case="277-postgrest-schema-cache-behavior" engine="next" command="sync" status="ERROR" -->
<!-- declarative-schema-command-result case="277-postgrest-schema-cache-behavior" engine="next" command="sync-verification" status="ERROR" -->

