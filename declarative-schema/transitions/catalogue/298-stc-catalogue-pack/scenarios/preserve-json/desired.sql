-- Covers PG-CAT-STC-11::preserve.json. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_preserve_json (
  id bigint primary key, label text, extra text
);
