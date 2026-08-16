-- Covers PG-CAT-TYP-03::composite.drop-attribute. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_composite_drop_attribute (
  id bigint primary key, label text, extra text
);
