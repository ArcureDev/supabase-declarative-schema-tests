create function public.configured_now()
returns timestamptz
language sql
stable
set timezone to 'UTC'
set statement_timeout to '5s'
as $$
  select now();
$$;
