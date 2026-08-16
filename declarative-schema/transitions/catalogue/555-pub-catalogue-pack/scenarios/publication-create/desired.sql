-- Covers PG-CAT-PUB-01::publication.create. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_publication_create (
  id bigint primary key, label text, extra text
);
