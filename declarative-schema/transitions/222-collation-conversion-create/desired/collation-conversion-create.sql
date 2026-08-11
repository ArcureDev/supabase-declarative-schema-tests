create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create collation public.transition_icu_222 (
  provider = icu,
  locale = 'und',
  deterministic = true
);
create conversion public.transition_utf8_latin1_222
  for 'UTF8' to 'LATIN1'
  from pg_catalog.utf8_to_iso8859_1;
