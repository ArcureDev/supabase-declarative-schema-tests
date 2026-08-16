-- Covers PG-CAT-CIX-05::index.move. Keep public.transition_anchor identity stable. PostgreSQL RENAME/SET SCHEMA preserves OIDs; an unhinted declarative pair must not silently drop data.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_rename_target (
  id bigint primary key, label text
);
