-- Covers PG-CAT-STC-11::preserve.identity. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_preserve_identity (
  id bigint primary key, label text
);
