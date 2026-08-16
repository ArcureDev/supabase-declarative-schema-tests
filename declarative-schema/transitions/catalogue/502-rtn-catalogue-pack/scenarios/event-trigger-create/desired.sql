-- Covers PG-CAT-RTN-07::event-trigger.create. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_event_trigger_create (
  id bigint primary key, label text, extra text
);
