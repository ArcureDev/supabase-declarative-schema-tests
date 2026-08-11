-- Negative fixture: payload intentionally conflicts with the first definition.
create table public.coverage_conflict (
  id bigint primary key,
  payload integer not null
);
