create schema if not exists extensions;
create schema if not exists app;

create extension if not exists pg_trgm
with schema public;

create extension if not exists vector
with schema extensions;

create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table app.catalog_items (
  id bigint primary key,
  title text not null,
  description text not null,
  facets jsonb not null default '{}'::jsonb,
  search_document tsvector generated always as
    (to_tsvector('simple', title || ' ' || description)) stored
);

create index catalog_search_idx
on app.catalog_items
using gin (search_document);

create index catalog_title_trgm_idx
on app.catalog_items
using gin (title public.gin_trgm_ops);

create table app.documents (
  id bigint primary key,
  storage_object_key text not null unique,
  model_version text not null default 'embed-v1'
);

create table app.chunks (
  id bigint primary key,
  document_id bigint not null references app.documents (id),
  body text not null,
  embedding extensions.vector(3)
);

create index chunks_embedding_v1_idx
on app.chunks
using hnsw (embedding extensions.vector_cosine_ops);
