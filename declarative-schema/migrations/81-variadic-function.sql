create function public.sum_variadic(variadic nums integer[])
returns integer
language sql
immutable
strict
as $$
  select coalesce(sum(value), 0)::integer
  from unnest(nums) as value;
$$;
