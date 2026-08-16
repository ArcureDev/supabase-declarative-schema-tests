-- Covers PG-CAT-EXT-03::foreign-table.create. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_foreign_table_create (
  id bigint primary key, label text
);
