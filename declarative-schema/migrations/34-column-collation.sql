create table public.catalog_labels (
  id bigint generated always as identity primary key,
  label text collate "C" not null
);
