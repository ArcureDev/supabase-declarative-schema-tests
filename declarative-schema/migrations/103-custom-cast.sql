create type public.cents as (
  amount integer
);

create function public.cents_to_integer(value public.cents)
returns integer
language sql
immutable
strict
as $$
  select value.amount;
$$;

create cast (public.cents as integer)
with function public.cents_to_integer(public.cents)
as assignment;
