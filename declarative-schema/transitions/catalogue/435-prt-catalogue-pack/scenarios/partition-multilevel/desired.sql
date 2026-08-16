-- Covers PG-CAT-PRT-01::partition.multilevel. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_partition_multilevel (
  id bigint primary key, label text, extra text
);
