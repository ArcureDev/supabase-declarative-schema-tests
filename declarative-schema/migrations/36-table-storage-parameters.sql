create table public.event_buffer (
  id bigint generated always as identity primary key,
  payload jsonb not null
) with (
  fillfactor = 70,
  autovacuum_vacuum_scale_factor = 0.05
);
