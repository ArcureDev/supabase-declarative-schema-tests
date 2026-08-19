# Case: 283-auth-storage-realtime-config

- Coverage: Boot non-default Auth, Storage, and Realtime local configuration and probe the enabled Auth and Storage services.
- Requirements: `C1`

## Stop prior local runtime (service plane)

- Command: `npx supabase stop --no-backup`
- Result: **ERROR**
- Duration: `3635.4s`

```text
Stopping containers...
Assertion failed: status ERROR was not one of OK
```

## Start fixture local runtime (service plane)

- Command: `phase:start`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): stop.
```

## Capture local service endpoints (service plane)

- Command: `phase:runtime-status`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): start.
```

## Probe configured Auth service (service plane)

- Command: `phase:auth-health`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): runtime-status.
```

## Probe configured Storage service (service plane)

- Command: `phase:storage-health`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): runtime-status.
```

## Probe configured Realtime service (service plane)

- Command: `phase:realtime-health`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Blocked by unsuccessful phase(s): runtime-status.
```

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **ERROR**
- Duration: `0.0s`
- Exit code: `1`

```text
(no output)
```
<!-- declarative-schema-command-result case="283-auth-storage-realtime-config" engine="next" command="generate" status="ERROR" -->
<!-- declarative-schema-command-result case="283-auth-storage-realtime-config" engine="next" command="sync" status="ERROR" -->
<!-- declarative-schema-command-result case="283-auth-storage-realtime-config" engine="next" command="sync-verification" status="ERROR" -->

