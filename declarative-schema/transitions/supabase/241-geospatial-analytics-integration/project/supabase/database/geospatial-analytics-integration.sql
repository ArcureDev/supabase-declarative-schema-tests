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
