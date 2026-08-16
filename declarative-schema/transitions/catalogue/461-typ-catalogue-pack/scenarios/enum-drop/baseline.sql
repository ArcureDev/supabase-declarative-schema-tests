-- Covers PG-CAT-TYP-01::enum.drop. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_enum_drop (
  id bigint primary key, label text
);
