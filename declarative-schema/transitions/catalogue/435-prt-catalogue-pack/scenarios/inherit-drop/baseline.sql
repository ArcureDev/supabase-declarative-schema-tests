-- Covers PG-CAT-PRT-06::inherit.drop. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_inherit_drop (
  id bigint primary key, label text
);
