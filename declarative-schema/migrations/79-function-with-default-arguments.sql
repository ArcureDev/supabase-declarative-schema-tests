create function public.greet_user(name text, greeting text default 'Hello')
returns text
language sql
immutable
strict
as $$
  select greeting || ', ' || name;
$$;
