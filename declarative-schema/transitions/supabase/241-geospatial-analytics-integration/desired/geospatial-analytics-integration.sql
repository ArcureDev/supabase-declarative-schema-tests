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
