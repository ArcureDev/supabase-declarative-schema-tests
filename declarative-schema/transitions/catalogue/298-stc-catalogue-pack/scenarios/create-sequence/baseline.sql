-- Covers PG-CAT-STC-09::create.sequence. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);
