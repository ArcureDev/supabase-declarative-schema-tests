-- Covers PG-CAT-CIX-01::fk.create. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_fk_create (
  id bigint primary key, label text, extra text
);
