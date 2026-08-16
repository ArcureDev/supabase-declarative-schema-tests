-- Covers PG-CAT-STC-01::drop.schema. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create schema catalogue_drop_schema;
