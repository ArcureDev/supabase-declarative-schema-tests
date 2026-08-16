-- Covers PG-CAT-PUB-01::publication.drop. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_publication_drop (
  id bigint primary key, label text, extra text
);
