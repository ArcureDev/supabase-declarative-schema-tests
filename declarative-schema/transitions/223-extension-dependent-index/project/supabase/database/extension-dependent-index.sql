create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.extension_docs_223 (
  id bigint generated always as identity primary key,
  body text not null
);
