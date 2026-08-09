create collation public.fixture_icu_english (
  provider = icu,
  locale = 'en-US',
  deterministic = true
);
