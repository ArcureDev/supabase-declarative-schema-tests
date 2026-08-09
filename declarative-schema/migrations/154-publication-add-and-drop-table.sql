create table public.publication_keep_items (
  id bigint generated always as identity primary key,
  payload text not null
);

create table public.publication_drop_items (
  id bigint generated always as identity primary key,
  payload text not null
);

create publication fixture_add_drop_publication
for table public.publication_keep_items, public.publication_drop_items;

alter publication fixture_add_drop_publication
  drop table public.publication_drop_items;
