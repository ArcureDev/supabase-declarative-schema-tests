-- Covers PG-CAT-STC-10::clustering. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_clustering (
  id bigint primary key, label text, extra text
);
