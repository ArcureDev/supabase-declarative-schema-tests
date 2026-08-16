-- Covers PG-CAT-ROL-05::rls.enable. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_rls_enable (
  id bigint primary key, label text, extra text
);
