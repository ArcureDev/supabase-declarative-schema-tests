-- Covers PG-CAT-STC-02::drop.table. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_drop_table (
  id bigint primary key, label text
);
