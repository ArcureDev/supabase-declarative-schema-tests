create table public.replication_boundary_items (
  id bigint generated always as identity primary key,
  payload text not null
);

create publication fixture_slot_boundary_publication
for table public.replication_boundary_items;
