-- Covers PG-CAT-TYP-04::multirange.create. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_multirange_create (
  id bigint primary key, label text
);
