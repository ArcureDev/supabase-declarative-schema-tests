-- Covers PG-CAT-RTN-08::routine.used-by-view. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_routine_used_by_view (
  id bigint primary key, label text
);
