-- Covers PG-CAT-STC-05::default.add. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_default_add (
  id bigint primary key, label text, extra text
);
