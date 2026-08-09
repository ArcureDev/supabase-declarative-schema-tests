create table public.accounts (
  id bigint generated always as identity primary key,
  display_name text not null
);
