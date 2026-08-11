create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.partition_events (
  id bigint not null,
  happened_on date not null,
  region text not null,
  payload text not null
) partition by range (happened_on);

create table public.partition_events_retire (
  id bigint not null,
  happened_on date not null,
  region text not null,
  payload text not null
);

create table public.partition_events_2024
partition of public.partition_events
for values from ('2024-01-01') to ('2024-07-01');

create table public.partition_events_2025
partition of public.partition_events
for values from ('2025-01-01') to ('2026-01-01')
partition by list (region);

create table public.partition_events_2025_eu
partition of public.partition_events_2025 for values in ('eu');
create table public.partition_events_2025_default
partition of public.partition_events_2025 default;
create table public.partition_events_2026
partition of public.partition_events
for values from ('2026-01-01') to ('2027-01-01');
create table public.partition_events_default
partition of public.partition_events default;

create table public.partition_metrics (
  id bigint not null,
  bucket integer not null
) partition by hash (bucket);
create table public.partition_metrics_p0
partition of public.partition_metrics
for values with (modulus 2, remainder 0);
create table public.partition_metrics_p1
partition of public.partition_metrics
for values with (modulus 2, remainder 1);
