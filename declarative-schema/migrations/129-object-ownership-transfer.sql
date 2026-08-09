create role fixture_object_owner nologin;

grant fixture_object_owner to current_user;
grant usage, create on schema public to fixture_object_owner;

create table public.reassigned_items (
  id bigint generated always as identity primary key,
  label text not null
);

alter table public.reassigned_items owner to fixture_object_owner;
