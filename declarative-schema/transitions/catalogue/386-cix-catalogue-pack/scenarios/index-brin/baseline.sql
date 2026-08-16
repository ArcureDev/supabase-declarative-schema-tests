-- Covers PG-CAT-CIX-06::index.brin. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_index_brin (
  id bigint primary key, label text
);
