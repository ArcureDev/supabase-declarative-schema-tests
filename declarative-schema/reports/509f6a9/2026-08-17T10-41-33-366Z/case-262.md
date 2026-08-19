# Case: 262-realtime-subscription-runtime

- Coverage: verify a publication-backed Realtime subscription boundary and local tenant health
- Requirements: `R4`
- Catalogue atoms: `PG-CAT-PUB-04::replication.runtime-state`

## Stop any prior shared runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **OK**
- Duration: `13.7s`

## Start the isolated local runtime (service plane)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `33.4s`

## Reset runtime state (service plane)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.1s`

## Create a publication-backed subscription source (service plane)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Resolve the local Realtime gateway (service plane)

- Command: `npx supabase status -o json`
- Result: **OK**
- Duration: `0.6s`

## Probe the authenticated Realtime tenant (service plane)

- Command: `GET http://127.0.0.1:54321/realtime/v1/api/tenants/realtime-dev/health`
- Result: **OK**
- Duration: `0.0s`

## Receive an inserted row over Realtime (service plane)

- Command: `node --experimental-strip-types E:\workspace\supabase-declarative-schema-tests\declarative-schema\coverage\service\262-realtime-subscription-runtime\subscribe.mts`
- Result: **ERROR**
- Duration: `1.3s`
- Exit code: `3221226505`

```text
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^
{
  code: '42501',
  details: null,
  hint: 'Grant the required privileges to the current role with: GRANT INSERT ON public.realtime_source_262 TO service_role;',
  message: 'permission denied for table realtime_source_262'
}

Node.js v26.3.1
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
Assertion failed: status ERROR was not one of OK
Assertion failed: output did not match required /"valid"\s*:\s*true/i
Assertion failed: output did not match required /"event"\s*:\s*"INSERT"/i
```

## Verify subscription metadata remains eligible (service plane)

- Command: `phase:verify-publication`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): subscription.
```

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **ERROR**
- Duration: `0.0s`
- Exit code: `1`

```text
(no output)
```
<!-- declarative-schema-command-result case="262-realtime-subscription-runtime" engine="next" command="generate" status="ERROR" -->
<!-- declarative-schema-command-result case="262-realtime-subscription-runtime" engine="next" command="sync" status="ERROR" -->
<!-- declarative-schema-command-result case="262-realtime-subscription-runtime" engine="next" command="sync-verification" status="ERROR" -->

