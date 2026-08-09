create table public.publication_items (
  id bigint generated always as identity primary key,
  payload text not null
);

create publication fixture_publication
for table public.publication_items;
