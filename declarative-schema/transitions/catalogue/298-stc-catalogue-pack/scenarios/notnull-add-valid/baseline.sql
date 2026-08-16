-- Covers PG-CAT-STC-06::notnull.add.valid. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_notnull_add_valid (
  id bigint primary key, label text
);
