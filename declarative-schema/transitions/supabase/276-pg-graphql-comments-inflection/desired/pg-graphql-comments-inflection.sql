-- Invariant: only application comments define GraphQL inflection.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_graphql;
create table public.graphql_notes_276 (
  id bigint generated always as identity primary key,
  label text not null
);
comment on table public.graphql_notes_276 is
  '@graphql({"name": "Memo276"})';
comment on column public.graphql_notes_276.label is
  '@graphql({"name": "displayLabel"})';
grant select on table public.graphql_notes_276 to anon, authenticated;
