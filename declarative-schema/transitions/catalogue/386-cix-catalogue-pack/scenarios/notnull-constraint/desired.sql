-- Covers PG-CAT-CIX-01::notnull.constraint. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_notnull_constraint (
  id bigint primary key, label text, extra text
);
