# Case: 347-identity-restart

- Scenario pack: `Schemas, tables, columns, and sequences catalogue scenarios` / `identity-restart`
- Catalogue atoms: `PG-CAT-STC-07::identity.restart`

## Baseline state A

```sql
-- Covers PG-CAT-STC-07::identity.restart. Keep public.transition_anchor identity stable. This atom is an explicit supported/unsupported boundary, not an accidental omission.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_probe (
  id bigint primary key, label text
);
```

## Desired state B

```sql
-- Covers PG-CAT-STC-07::identity.restart. Keep public.transition_anchor identity stable. This atom is an explicit supported/unsupported boundary, not an accidental omission.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_probe (
  id bigint primary key, label text
);
-- Desired change for identity.restart must be refused, not silently omitted.
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
```

## CLI-generated baseline migration files

_(no files generated)_

## Expected-unsupported diagnostic assertion

- Raw sync result: **SKIPPED**
- Assertion: **SKIPPED**
- The safety assertion did not run.

## Generated transition migration files

_(no files generated)_

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **ERROR**
- Duration: `1173.1s`

```text
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
```


## Establish baseline with declarative sync --apply

- Command: `docker exec ... psql --file -`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The baseline reset failed, so direct bootstrap was skipped.
```


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Baseline bootstrap failed, so unsupported-capability planning was skipped.
```
<!-- declarative-schema-command-result case="347-identity-restart" engine="next" command="sync" status="ERROR" -->

## Transition fallback (legacy)

- Overall result: **FAILED**
- Raw sync result: **OK**
- Assertion: **ERROR**
- The unsupported capability did not satisfy its diagnostic contract. Raw sync unexpectedly completed with status OK; promote this fixture to applicable-transition if support is intentional. Missing diagnostic(s): reports a stable capability or scope diagnostic.

### Legacy-generated baseline migration files

_(no files generated)_

### Legacy-generated transition migration files

### `20260815194940_declarative_sync.sql`

```sql
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.catalogue_probe (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_probe
  ADD CONSTRAINT catalogue_probe_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
```


### Start local runtime (legacy)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `7.1s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `34.7s`

### Establish baseline (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

### Insert representative data (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

### Capture baseline state (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

### Sync (legacy)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **ERROR**
- Duration: `18.3s`
- Exit code: `0`

```text
The unsupported capability did not satisfy its diagnostic contract. Raw sync unexpectedly completed with status OK; promote this fixture to applicable-transition if support is intentional. Missing diagnostic(s): reports a stable capability or scope diagnostic.
Raw sync status: OK
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta legacy implementation.
Creating shadow database...
Creating shadow database...
Applying declarative schemas via pg-delta...
Applied 4 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.catalogue_probe (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_probe
  ADD CONSTRAINT catalogue_probe_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-DHzNgi\347-identity-restart-legacy\supabase\migrations\20260815194940_declarative_sync.sql
Found drop statements in schema diff. Please double check if these are expected:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net
A new version of Supabase CLI is available: v2.114.0 (currently installed v0.0.0-pr.6203)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.catalogue_probe (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_probe
  ADD CONSTRAINT catalogue_probe_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
```
<!-- declarative-schema-command-result case="347-identity-restart" engine="legacy" command="sync" status="ERROR" -->

### Sync verification / convergence (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`
<!-- declarative-schema-command-result case="347-identity-restart" engine="legacy" command="sync-verification" status="OK" -->
