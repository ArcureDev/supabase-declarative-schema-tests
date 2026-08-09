create text search configuration public.fixture_ts_config_tmp (
  copy = pg_catalog.english
);

alter text search configuration public.fixture_ts_config_tmp
  rename to fixture_ts_config_renamed;
