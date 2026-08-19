# Case: 257-storage-api-data-boundary

- Coverage: exercise Storage API writes while verifying managed object metadata through SQL
- Requirements: `S3`

## Stop any prior shared runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **ERROR**
- Duration: `3637.2s`

```text
Stopping containers...
WARN: config section [inbucket] is deprecated. Please use [local_smtp] instead.
Assertion failed: status ERROR was not one of OK
```

## Start the isolated local runtime (service plane)

- Command: `phase:start`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): stop.
```

## Reset runtime state (service plane)

- Command: `phase:reset`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): start.
```

## Create the runtime-only Storage bucket (service plane)

- Command: `phase:setup`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): reset.
```

## Resolve local service endpoints (service plane)

- Command: `phase:status`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): setup.
```

## Upload through the local Storage API (service plane)

- Command: `phase:upload`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): status.
```

## Verify Storage-managed metadata (service plane)

- Command: `phase:verify-data`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): upload.
```

## Read the object through the local Storage API (service plane)

- Command: `phase:download`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): verify-data.
```

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **ERROR**
- Duration: `0.0s`
- Exit code: `1`

```text
(no output)
```
<!-- declarative-schema-command-result case="257-storage-api-data-boundary" engine="next" command="generate" status="ERROR" -->
<!-- declarative-schema-command-result case="257-storage-api-data-boundary" engine="next" command="sync" status="ERROR" -->
<!-- declarative-schema-command-result case="257-storage-api-data-boundary" engine="next" command="sync-verification" status="ERROR" -->

