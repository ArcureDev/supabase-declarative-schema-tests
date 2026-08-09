create function public.stable_parallel_safe_length(value text)
returns integer
language sql
stable
parallel safe
strict
as $$
  select length(value);
$$;
