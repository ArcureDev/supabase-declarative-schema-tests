-- Covers PG-CAT-STC-01::authorize.schema. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_authorize_schema (
  id bigint primary key, label text, extra text
);
