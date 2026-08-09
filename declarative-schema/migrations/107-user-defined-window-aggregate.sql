create function public.window_sum_integer_state(state bigint, value integer)
returns bigint
language sql
immutable
as $$
  select coalesce(state, 0) + coalesce(value, 0);
$$;

create function public.window_sum_integer_inverse(state bigint, value integer)
returns bigint
language sql
immutable
as $$
  select coalesce(state, 0) - coalesce(value, 0);
$$;

create aggregate public.window_sum_integer(integer) (
  sfunc = public.window_sum_integer_state,
  stype = bigint,
  msfunc = public.window_sum_integer_state,
  minvfunc = public.window_sum_integer_inverse,
  mstype = bigint,
  initcond = '0',
  minitcond = '0'
);
