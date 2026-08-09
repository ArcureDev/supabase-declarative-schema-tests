create table public.mutable_profiles (
  id bigint generated always as identity primary key,
  nickname text,
  legacy_code text
);

alter table public.mutable_profiles
  add column display_name text,
  drop column legacy_code;

alter table public.mutable_profiles
  rename column nickname to handle;
