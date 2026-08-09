create table public.labeled_items (
  id bigint generated always as identity primary key,
  label text not null
);

security label for pgsodium
on column public.labeled_items.label
is 'ENCRYPT WITH KEY ID 00000000-0000-0000-0000-000000000000';
