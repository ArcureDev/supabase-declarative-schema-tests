create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.identity_guard (
  id bigint generated always as identity primary key,
  title text not null
);
