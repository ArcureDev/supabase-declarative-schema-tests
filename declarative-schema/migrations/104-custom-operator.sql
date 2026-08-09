create function public.integer_near_eq(left_value integer, right_value integer)
returns boolean
language sql
immutable
strict
as $$
  select abs(left_value - right_value) <= 1;
$$;

create operator public.@=(
  leftarg = integer,
  rightarg = integer,
  function = public.integer_near_eq,
  commutator = @=
);
