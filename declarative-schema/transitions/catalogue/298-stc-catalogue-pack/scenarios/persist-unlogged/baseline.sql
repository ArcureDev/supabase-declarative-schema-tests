-- Covers PG-CAT-STC-02::persist.unlogged. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_persist_unlogged (
  id bigint primary key, label text
);
