-- Covers PG-CAT-STC-11::preserve.bytea. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_preserve_bytea (
  id bigint primary key, label text
);
