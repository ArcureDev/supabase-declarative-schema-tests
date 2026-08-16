-- Covers PG-CAT-STC-08::column-privileges. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_column_privileges (
  id bigint primary key, label text
);
