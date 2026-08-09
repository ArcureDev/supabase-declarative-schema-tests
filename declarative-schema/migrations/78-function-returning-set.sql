create function public.generate_integers(limit_value integer)
returns setof integer
language sql
immutable
strict
as $$
  select generate_series(1, limit_value);
$$;
