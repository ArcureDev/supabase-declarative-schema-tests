create schema if not exists extensions;

create extension if not exists unaccent
with schema extensions;

create text search configuration public.french_unaccent (
  copy = pg_catalog.french
);

alter text search configuration public.french_unaccent
  alter mapping for hword, hword_part, word
  with extensions.unaccent, french_stem;
