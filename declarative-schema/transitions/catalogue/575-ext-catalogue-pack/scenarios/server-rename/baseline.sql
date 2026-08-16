-- Covers PG-CAT-EXT-03::server.rename. Keep public.transition_anchor identity stable. PostgreSQL RENAME/SET SCHEMA preserves OIDs; an unhinted declarative pair must not silently drop data.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_rename_source (
  id bigint primary key, label text
);
