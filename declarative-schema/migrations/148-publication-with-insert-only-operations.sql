create table public.publication_insert_only_items (
  id bigint generated always as identity primary key,
  payload text not null
);

create publication fixture_insert_only_publication
for table public.publication_insert_only_items
with (publish = 'insert');
