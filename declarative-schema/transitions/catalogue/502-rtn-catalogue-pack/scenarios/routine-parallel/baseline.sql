-- Covers PG-CAT-RTN-02::routine.parallel. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_routine_parallel (
  id bigint primary key, label text
);
