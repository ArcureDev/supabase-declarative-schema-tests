create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create type public.transition_scalar as (
  amount integer
);

create function public.transition_scalar_to_integer(value public.transition_scalar)
returns integer
language sql
immutable
strict
as $$
  select value.amount
$$;

create function public.transition_near(
  left_value integer,
  right_value integer
)
returns boolean
language sql
immutable
strict
as $$
  select abs(left_value - right_value) <= 1
$$;
