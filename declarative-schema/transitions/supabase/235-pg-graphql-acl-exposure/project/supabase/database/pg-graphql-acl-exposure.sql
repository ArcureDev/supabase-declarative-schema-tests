create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_graphql;
create table public.graphql_items_235 (
  id bigint generated always as identity primary key,
  label text not null
);
revoke all on table public.graphql_items_235 from anon;
grant select on table public.graphql_items_235 to authenticated;
