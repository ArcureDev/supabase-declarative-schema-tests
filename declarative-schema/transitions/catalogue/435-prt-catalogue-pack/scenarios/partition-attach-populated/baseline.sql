-- Covers PG-CAT-PRT-04::partition.attach-populated. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_partition_attach_populated (
  id bigint primary key, label text
);
