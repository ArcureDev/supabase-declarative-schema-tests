create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create sequence public.transition_ticket_seq
  as bigint
  start with 10
  increment by 5
  minvalue 5
  maxvalue 1000
  cache 20
  cycle;

create table public.sequence_option_guard (
  id bigint primary key default nextval('public.transition_ticket_seq'),
  payload text not null
);
