create function public.add_numbers(left_value integer, right_value integer)
returns integer
language sql
immutable
strict
as $$
  select left_value + right_value;
$$;
