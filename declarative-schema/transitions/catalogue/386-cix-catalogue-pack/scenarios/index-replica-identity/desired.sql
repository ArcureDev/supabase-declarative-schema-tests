-- Covers PG-CAT-CIX-07::index.replica-identity. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_index_replica_identity (
  id bigint primary key, label text, extra text
);
