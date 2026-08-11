create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_numbers (
  value integer not null
);

create function public.transition_sum_state(state integer, value integer)
returns integer
language sql
immutable
strict
as $$
  select state + value
$$;

create aggregate public.transition_sum(integer) (
  sfunc = public.transition_sum_state,
  stype = integer,
  initcond = '10'
);
