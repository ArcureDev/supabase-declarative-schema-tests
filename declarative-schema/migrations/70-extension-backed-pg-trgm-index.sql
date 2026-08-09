create schema if not exists extensions;

create extension if not exists pg_trgm
with schema extensions;

create table public.fuzzy_titles (
  id bigint generated always as identity primary key,
  title text not null
);

create index fuzzy_titles_title_trgm_idx
on public.fuzzy_titles using gin (title extensions.gin_trgm_ops);
