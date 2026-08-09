create text search parser public.fixture_default_parser (
  start = prsd_start,
  gettoken = prsd_nexttoken,
  end = prsd_end,
  lextypes = prsd_lextype,
  headline = prsd_headline
);
