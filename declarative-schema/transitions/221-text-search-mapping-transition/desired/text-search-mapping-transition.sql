create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create text search configuration public.transition_search_221 (
  copy = pg_catalog.english
);
alter text search configuration public.transition_search_221
  alter mapping for asciiword
  with pg_catalog.english_stem;
