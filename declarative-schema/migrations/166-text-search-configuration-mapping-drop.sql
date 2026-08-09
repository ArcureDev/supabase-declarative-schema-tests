create text search configuration public.fixture_mapping_drop (
  copy = pg_catalog.english
);

alter text search configuration public.fixture_mapping_drop
  drop mapping for email;
