-- Covers PG-CAT-RTN-03::routine.variadic. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_routine_variadic (
  id bigint primary key, label text, extra text
);
