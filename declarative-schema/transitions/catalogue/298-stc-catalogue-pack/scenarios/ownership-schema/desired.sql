-- Covers PG-CAT-STC-01::ownership.schema. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_ownership_schema (
  id bigint primary key, label text, extra text
);
