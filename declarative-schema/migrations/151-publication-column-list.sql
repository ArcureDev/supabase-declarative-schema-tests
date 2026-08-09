create table public.publication_column_items (
  id bigint generated always as identity primary key,
  payload text not null,
  secret text
);

create publication fixture_column_list_publication
for table public.publication_column_items (id, payload);
