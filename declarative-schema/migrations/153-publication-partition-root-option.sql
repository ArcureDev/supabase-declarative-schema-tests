create table public.publication_partitioned_items (
  id bigint not null,
  recorded_on date not null,
  payload text not null,
  constraint publication_partitioned_items_pkey primary key (id, recorded_on)
) partition by range (recorded_on);

create publication fixture_partition_root_publication
for table public.publication_partitioned_items
with (publish_via_partition_root = true);
