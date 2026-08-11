-- Negative fixture: the same qualified relation must not be merged silently.
create table public.coverage_conflict (
  id bigint primary key,
  payload text not null
);
