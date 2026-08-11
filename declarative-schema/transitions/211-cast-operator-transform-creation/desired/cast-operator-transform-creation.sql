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

create function public.transition_scalar_from_sql(internal)
returns internal
language internal
immutable
strict
as 'textlike_support';

create cast (public.transition_scalar as integer)
with function public.transition_scalar_to_integer(public.transition_scalar)
as assignment;

create operator public.~= (
  leftarg = integer,
  rightarg = integer,
  function = public.transition_near
);

create transform for public.transition_scalar language plpgsql (
  from sql with function public.transition_scalar_from_sql(internal)
);
