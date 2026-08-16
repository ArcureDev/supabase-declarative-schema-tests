-- Covers PG-CAT-PRT-05::partition.fk. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_partition_fk (
  id bigint primary key, label text
);
