create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create sequence public.transition_owned_seq start with 100;

create table public.sequence_owner_guard (
  id bigint primary key default nextval('public.transition_owned_seq'),
  payload text not null
);
