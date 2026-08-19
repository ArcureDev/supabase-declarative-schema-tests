# Case: 274-postgis-generated-geography

## Baseline state A

```sql
-- Invariant: longitude and latitude are the source of truth before generation.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists postgis with schema extensions;
create table public.generated_places_274 (
  id bigint generated always as identity primary key,
  name text not null,
  longitude double precision not null,
  latitude double precision not null
);
```

## Desired state B

```sql
-- Invariant: geography is derived deterministically from preserved coordinates.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists postgis with schema extensions;
create table public.generated_places_274 (
  id bigint generated always as identity primary key,
  name text not null,
  longitude double precision not null,
  latitude double precision not null,
  location extensions.geography(point, 4326)
    generated always as (
      extensions.st_setsrid(
        extensions.st_makepoint(longitude, latitude),
        4326
      )::extensions.geography
    ) stored
);
```

## Representative data setup

```sql
-- Invariant: generated geography must backfill existing coordinate rows.
insert into public.transition_anchor (case_no, payload)
values (274, 'case-274');

insert into public.generated_places_274 (name, longitude, latitude)
values
  ('Amsterdam', 4.9041, 52.3676),
  ('Paris', 2.3522, 48.8566);
```

## CLI-generated baseline migration files

### `20260818000137_274_postgis_generated_geography_baseline.sql`

```sql
set local check_function_bodies = off;

create extension "postgis" schema "extensions";

create table "public"."generated_places_274" (
  "id"        bigint           generated always as identity not null,
  "name"      text             not null,
  "longitude" double precision not null,
  "latitude"  double precision not null,
  constraint "generated_places_274_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

comment on extension "postgis" is 'PostGIS geometry and geography spatial types and functions';

grant maintain, references, trigger, truncate on table "public"."generated_places_274" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."generated_places_274" to "postgres";

grant maintain, references, trigger, truncate on table "public"."generated_places_274" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260818000219_declarative_sync.sql`

```sql
alter table "public"."generated_places_274"
  add column "location" extensions.geography(Point,4326) generated always as ((extensions.st_setsrid(extensions.st_makepoint(longitude, latitude), 4326))::extensions.geography)
    stored;
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.5s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 274_postgis_generated_geography_baseline --debug`
- Result: **OK**
- Duration: `50.6s`

## Insert representative data

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Baseline state capture

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `41.3s`
<!-- declarative-schema-command-result case="274-postgis-generated-geography" engine="next" command="sync" status="OK" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **OK**
- Duration: `0.6s`

## Verify desired state B

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `50.5s`
<!-- declarative-schema-command-result case="274-postgis-generated-geography" engine="next" command="sync-verification" status="OK" -->

