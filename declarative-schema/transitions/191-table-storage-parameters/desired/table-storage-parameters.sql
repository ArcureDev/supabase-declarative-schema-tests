create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.storage_parameter_guard (
  id bigint primary key,
  payload text not null
) with (fillfactor = 70);
