-- Covers PG-CAT-CIX-05::index.sort. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_index_sort (
  id bigint primary key, label text, extra text
);
