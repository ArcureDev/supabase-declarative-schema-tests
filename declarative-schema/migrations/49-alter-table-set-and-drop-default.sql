create table public.preference_flags (
  id bigint generated always as identity primary key,
  is_enabled boolean
);

alter table public.preference_flags
  alter column is_enabled set default true;

alter table public.preference_flags
  alter column is_enabled drop default;
