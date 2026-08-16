-- Covers PG-CAT-STC-05::default.expression. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_default_expression (
  id bigint primary key, label text
);
