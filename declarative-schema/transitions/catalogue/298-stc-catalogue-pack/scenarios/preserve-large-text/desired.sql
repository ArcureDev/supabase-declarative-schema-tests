-- Covers PG-CAT-STC-11::preserve.large-text. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_preserve_large_text (
  id bigint primary key, label text, extra text
);
