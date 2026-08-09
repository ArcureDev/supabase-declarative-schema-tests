create table public.profile_names (
  id bigint generated always as identity primary key,
  display_name text not null
);

create view public.profile_names_view as
select id, display_name
from public.profile_names;

create function public.profile_names_view_insert()
returns trigger
language plpgsql
as $$
begin
  insert into public.profile_names (display_name)
  values (new.display_name)
  returning id into new.id;
  return new;
end;
$$;

create trigger profile_names_view_instead_of_insert
instead of insert on public.profile_names_view
for each row
execute function public.profile_names_view_insert();
