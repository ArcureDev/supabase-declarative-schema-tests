-- Covers PG-CAT-CIX-01::pk.drop. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_pk_drop (
  id bigint primary key, label text, extra text
);
