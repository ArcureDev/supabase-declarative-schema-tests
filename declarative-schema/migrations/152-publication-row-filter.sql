create table public.publication_filtered_items (
  id bigint generated always as identity primary key,
  is_public boolean not null default false,
  payload text not null
);

create publication fixture_row_filter_publication
for table public.publication_filtered_items
where (is_public);
