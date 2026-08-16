-- Covers PG-CAT-CIX-06::index.extension. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_index_extension (
  id bigint primary key, label text
);
