create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.default_guard (
  id bigint primary key,
  status text not null default 'before'
);
