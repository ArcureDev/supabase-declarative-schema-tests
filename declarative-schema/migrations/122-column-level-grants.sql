create table public.column_grant_profiles (
  id bigint generated always as identity primary key,
  display_name text not null,
  secret_note text
);

grant select (id, display_name) on table public.column_grant_profiles to authenticated;
