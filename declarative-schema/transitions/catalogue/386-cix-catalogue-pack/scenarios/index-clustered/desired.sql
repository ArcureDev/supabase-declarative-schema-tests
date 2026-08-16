-- Covers PG-CAT-CIX-07::index.clustered. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_index_clustered (
  id bigint primary key, label text, extra text
);
