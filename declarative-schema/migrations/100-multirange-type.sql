create type public.fixture_int_range as range (
  subtype = integer
);

create table public.fixture_int_multirange_values (
  id bigint generated always as identity primary key,
  spans public.fixture_int_multirange not null
);
