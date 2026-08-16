-- Covers PG-CAT-FTS-02::collation.create. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_collation_create (
  id bigint primary key, label text
);
