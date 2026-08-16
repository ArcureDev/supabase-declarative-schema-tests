-- Covers PG-CAT-CIX-04::index.replace-constraint. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_index_replace_constraint (
  id bigint primary key, label text
);
