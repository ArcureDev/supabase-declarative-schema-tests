-- Covers PG-CAT-CIX-03::not-valid.create. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_not_valid_create (
  id bigint primary key, label text, extra text
);
