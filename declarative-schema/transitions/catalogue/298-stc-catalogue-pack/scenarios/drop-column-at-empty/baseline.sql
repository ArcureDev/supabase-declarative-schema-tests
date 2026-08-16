-- Covers PG-CAT-STC-03::drop.column@empty. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_drop_column_at_empty (
  id bigint primary key, label text
);
