-- Covers PG-CAT-STC-08::compression. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_compression (
  id bigint primary key, label text
);
