create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.type_widening_guard (
  id bigint primary key,
  amount bigint not null
);
