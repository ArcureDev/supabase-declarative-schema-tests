create function public.sum_integer_state(state bigint, value integer)
returns bigint
language sql
immutable
strict
as $$
  select state + value;
$$;

create aggregate public.sum_integer(integer) (
  sfunc = public.sum_integer_state,
  stype = bigint,
  initcond = '0'
);
