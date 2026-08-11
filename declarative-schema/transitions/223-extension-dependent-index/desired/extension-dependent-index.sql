create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_trgm with schema extensions;
create table public.extension_docs_223 (
  id bigint generated always as identity primary key,
  body text not null
);
create index transition_docs_trgm_223
  on public.extension_docs_223
  using gin (body extensions.gin_trgm_ops);
