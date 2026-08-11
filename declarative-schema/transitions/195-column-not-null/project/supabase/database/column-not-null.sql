create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.not_null_guard (
  id bigint primary key,
  note text
);
