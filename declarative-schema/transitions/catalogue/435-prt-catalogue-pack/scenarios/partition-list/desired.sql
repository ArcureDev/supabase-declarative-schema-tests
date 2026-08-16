-- Covers PG-CAT-PRT-01::partition.list. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_partition_list (
  id bigint primary key, label text, extra text
);
