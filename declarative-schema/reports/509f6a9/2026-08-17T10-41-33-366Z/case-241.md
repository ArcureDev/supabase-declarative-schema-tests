# Case: 241-geospatial-analytics-integration

## Baseline state A

```sql
create schema if not exists extensions;
create schema if not exists geodata;
create schema if not exists analytics;

create extension if not exists postgis
with schema extensions;

create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table geodata.regions (
  id bigint primary key,
  tenant_id bigint not null,
  boundary extensions.geometry(Polygon, 4326) not null
);

create table geodata.places (
  id bigint primary key,
  region_id bigint not null references geodata.regions (id),
  name text not null,
  location extensions.geometry(Point, 4326) not null
);

create table analytics.events (
  id bigint not null,
  tenant_id bigint not null,
  event_kind text not null,
  occurred_on date not null,
  payload jsonb not null,
  primary key (id, occurred_on)
)
partition by range (occurred_on);

create table analytics.events_2026_q3
partition of analytics.events
for values from ('2026-07-01') to ('2026-10-01');
```

## Desired state B

```sql
create schema if not exists extensions;
create schema if not exists geodata;
create schema if not exists analytics;

create extension if not exists postgis
with schema extensions;

create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table geodata.regions (
  id bigint primary key,
  tenant_id bigint not null,
  boundary extensions.geometry(Polygon, 4326) not null
);

create table geodata.places (
  id bigint primary key,
  region_id bigint not null references geodata.regions (id),
  name text not null,
  location extensions.geometry(Point, 4326) not null,
  location_webmercator extensions.geometry(Point, 3857)
    generated always as
      (extensions.st_transform(location, 3857)) stored
);

create index places_location_gist_idx
on geodata.places
using gist (location);

alter table geodata.places enable row level security;

create policy places_region_access
on geodata.places
for select
to authenticated
using (
  region_id = nullif(auth.jwt() ->> 'region_id', '')::bigint
);

create table analytics.events (
  id bigint not null,
  tenant_id bigint not null,
  event_kind text not null,
  occurred_on date not null,
  payload jsonb not null,
  primary key (id, occurred_on)
)
partition by range (occurred_on);

create table analytics.events_2026_q3
partition of analytics.events
for values from ('2026-07-01') to ('2026-10-01');

create table analytics.events_2026_q4
partition of analytics.events
for values from ('2026-10-01') to ('2027-01-01');

create materialized view analytics.daily_event_totals
as
select
  event.occurred_on,
  event.tenant_id,
  event.event_kind,
  count(*)::bigint as event_count
from analytics.events as event
group by event.occurred_on, event.tenant_id, event.event_kind
with no data;

create unique index daily_event_totals_key
on analytics.daily_event_totals (
  occurred_on,
  tenant_id,
  event_kind
);

create publication ds_241_analytics_publication
for table analytics.events
with (
  publish = 'insert, update',
  publish_via_partition_root = true
);

create foreign data wrapper ds_241_partner_fdw;

create server ds_241_partner_server
foreign data wrapper ds_241_partner_fdw;

create foreign table analytics.partner_events (
  external_id text,
  occurred_at timestamptz,
  payload jsonb
)
server ds_241_partner_server;
```

## Representative data setup

```sql
insert into public.transition_anchor (id, payload)
values (241, 'geospatial-analytics');

insert into geodata.regions (id, tenant_id, boundary)
values (
  1,
  7,
  extensions.st_geomfromtext(
    'POLYGON((-1 -1,-1 1,1 1,1 -1,-1 -1))',
    4326
  )
);

insert into geodata.places (id, region_id, name, location)
values (
  1,
  1,
  'Origin',
  extensions.st_geomfromtext('POINT(0 0)', 4326)
);

insert into analytics.events (
  id,
  tenant_id,
  event_kind,
  occurred_on,
  payload
)
values (1, 7, 'visit', '2026-08-10', '{"place":1}'::jsonb);
```

## CLI-generated baseline migration files

### `20260817214202_241_geospatial_analytics_integration_baseline.sql`

```sql
set local check_function_bodies = off;

create schema "analytics";

create schema "geodata";

create extension "postgis" schema "extensions";

create table "analytics"."events" (
  "id"          bigint not null,
  "tenant_id"   bigint not null,
  "event_kind"  text   not null,
  "occurred_on" date   not null,
  "payload"     jsonb  not null
) partition by range (occurred_on);

create table "analytics"."events_2026_q3" partition of "analytics"."events" for values from ('2026-07-01') to ('2026-10-01');

create table "geodata"."places" (
  "id"        bigint                          not null,
  "region_id" bigint                          not null,
  "name"      text                            not null,
  "location"  extensions.geometry(Point,4326) not null,
  constraint "places_pkey" primary key (id)
);

create table "geodata"."regions" (
  "id"        bigint                            not null,
  "tenant_id" bigint                            not null,
  "boundary"  extensions.geometry(Polygon,4326) not null,
  constraint "regions_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

alter table "analytics"."events"
  add constraint "events_pkey" primary key (id, occurred_on);

alter table "geodata"."places"
  add constraint "places_region_id_fkey" foreign key (region_id) references geodata.regions(id);

comment on extension "postgis" is 'PostGIS geometry and geography spatial types and functions';

grant create, usage on schema "analytics" to "postgres";

grant create, usage on schema "geodata" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "analytics"."events" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "analytics"."events_2026_q3" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "geodata"."places" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "geodata"."regions" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817214302_declarative_sync.sql`

```sql
create foreign data wrapper "ds_241_partner_fdw";

create server "ds_241_partner_server"
  foreign data wrapper "ds_241_partner_fdw";

create table "analytics"."events_2026_q4" partition of "analytics"."events" for values from ('2026-10-01') to ('2027-01-01');

alter table "geodata"."places"
  enable row level security;

alter table "geodata"."places"
  add column "location_webmercator" extensions.geometry(Point,3857) generated always as (extensions.st_transform(location, 3857)) stored;

create foreign table "analytics"."partner_events" () server "ds_241_partner_server";

alter table "analytics"."partner_events"
  add column "external_id" text;

alter table "analytics"."partner_events"
  add column "occurred_at" timestamp with time zone;

alter table "analytics"."partner_events"
  add column "payload" jsonb;

create materialized view "analytics"."daily_event_totals"
  AS  SELECT occurred_on,
    tenant_id,
    event_kind,
    count(*) AS event_count
   FROM analytics.events event
  GROUP BY occurred_on, tenant_id, event_kind;

create unique index daily_event_totals_key on analytics.daily_event_totals using btree (occurred_on, tenant_id, event_kind);

create index places_location_gist_idx on geodata.places using gist (location);

create policy "places_region_access" on "geodata"."places"
  for select
  to "authenticated"
  using ((region_id = (NULLIF((auth.jwt() ->> 'region_id'::text), ''::text))::bigint));

create publication "ds_241_analytics_publication" for table "analytics"."events" with (
  publish                    = 'insert, update',
  publish_via_partition_root = true
);

grant delete, insert, maintain, references, select, trigger, truncate, update on table "analytics"."partner_events" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "analytics"."daily_event_totals" to "postgres";

grant usage on foreign server "ds_241_partner_server" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "analytics"."events_2026_q4" to "postgres";
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `20.9s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 241_geospatial_analytics_integration_baseline --debug`
- Result: **OK**
- Duration: `60.2s`

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
- Duration: `60.1s`
<!-- declarative-schema-command-result case="241-geospatial-analytics-integration" engine="next" command="sync" status="OK" -->

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
- Duration: `43.7s`
<!-- declarative-schema-command-result case="241-geospatial-analytics-integration" engine="next" command="sync-verification" status="OK" -->

