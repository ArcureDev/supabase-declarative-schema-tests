-- Covers PG-CAT-STC-08::statistics-target. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_statistics_target (
  id bigint primary key, label text
);
