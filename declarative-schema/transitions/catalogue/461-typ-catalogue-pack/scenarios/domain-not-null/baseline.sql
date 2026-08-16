-- Covers PG-CAT-TYP-02::domain.not-null. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_domain_not_null (
  id bigint primary key, label text
);
