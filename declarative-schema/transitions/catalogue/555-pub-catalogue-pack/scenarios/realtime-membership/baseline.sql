-- Covers PG-CAT-PUB-02::realtime.membership. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_realtime_membership (
  id bigint primary key, label text
);
