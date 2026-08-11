-- Invariant: comments are application metadata; pg_graphql remains extension-owned.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_graphql;
create table public.graphql_notes_276 (
  id bigint generated always as identity primary key,
  label text not null
);
comment on table public.graphql_notes_276 is 'case 276 baseline table';
comment on column public.graphql_notes_276.label is 'case 276 baseline label';
grant select on table public.graphql_notes_276 to anon, authenticated;
