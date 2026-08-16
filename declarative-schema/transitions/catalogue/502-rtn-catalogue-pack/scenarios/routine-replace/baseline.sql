-- Covers PG-CAT-RTN-02::routine.replace. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_routine_replace (
  id bigint primary key, label text
);
