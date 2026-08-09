create text search configuration public.fixture_mapping_add (
  copy = pg_catalog.simple
);

alter text search configuration public.fixture_mapping_add
  add mapping for tag
  with pg_catalog.english_stem;
