create table public.people (
  id bigint generated always as identity primary key,
  first_name text not null,
  last_name text not null
);

create function public.list_people()
returns table (
  id bigint,
  full_name text
)
language sql
stable
as $$
  select people.id, people.first_name || ' ' || people.last_name
  from public.people;
$$;
