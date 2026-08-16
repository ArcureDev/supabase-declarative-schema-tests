-- Covers PG-CAT-PRT-06::inherit.multiple. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_inherit_multiple (
  id bigint primary key, label text, extra text
);
