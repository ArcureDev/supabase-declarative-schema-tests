create table public.publication_truncate_items (
  id bigint generated always as identity primary key,
  payload text not null
);

create publication fixture_truncate_publication
for table public.publication_truncate_items
with (publish = 'truncate');
