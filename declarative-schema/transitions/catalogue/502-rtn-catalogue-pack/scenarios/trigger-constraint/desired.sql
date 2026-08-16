-- Covers PG-CAT-RTN-06::trigger.constraint. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_trigger_constraint (
  id bigint primary key, label text, extra text
);
