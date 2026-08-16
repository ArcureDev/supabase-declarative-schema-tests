-- Covers PG-CAT-STC-03::add.column@empty. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_add_column_at_empty (
  id bigint primary key, label text, extra text
);
