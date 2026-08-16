-- Covers PG-CAT-STC-08::column-options. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_column_options (
  id bigint primary key, label text, extra text
);
