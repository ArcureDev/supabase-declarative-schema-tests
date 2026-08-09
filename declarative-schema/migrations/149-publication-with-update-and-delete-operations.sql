create table public.publication_update_delete_items (
  id bigint generated always as identity primary key,
  payload text not null
);

create publication fixture_update_delete_publication
for table public.publication_update_delete_items
with (publish = 'update, delete');
