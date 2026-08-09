create text search configuration public.fixture_mapping_replace (
  copy = pg_catalog.english
);

alter text search configuration public.fixture_mapping_replace
  alter mapping for asciiword
  with pg_catalog.simple;
