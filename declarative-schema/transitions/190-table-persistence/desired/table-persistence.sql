create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create unlogged table public.persistence_guard (
  id bigint primary key,
  payload text not null
);
