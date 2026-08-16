-- Covers PG-CAT-RTN-02::routine.volatility. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_routine_volatility (
  id bigint primary key, label text
);
