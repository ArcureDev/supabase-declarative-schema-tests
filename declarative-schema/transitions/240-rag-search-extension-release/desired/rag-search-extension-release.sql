create schema if not exists extensions;
create schema if not exists app;

create extension if not exists pg_trgm
with schema extensions;

create extension if not exists vector
with schema extensions;

create text search configuration app.catalog_english
(copy = pg_catalog.english);

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
    (to_tsvector('simple', title || ' ' || description)) stored,
  catalog_search_v2 tsvector generated always as
    (
      to_tsvector(
        'app.catalog_english'::regconfig,
        title || ' ' || description
      )
    ) stored
);

create index catalog_search_idx
on app.catalog_items
using gin (search_document);

create index catalog_title_trgm_idx
on app.catalog_items
using gin (title extensions.gin_trgm_ops);

create index catalog_search_v2_idx
on app.catalog_items
using gin (catalog_search_v2);

create index catalog_facets_idx
on app.catalog_items
using gin (facets);

create table app.documents (
  id bigint primary key,
  storage_object_key text not null unique,
  model_version text not null default 'embed-v1'
);

create table app.chunks (
  id bigint primary key,
  document_id bigint not null references app.documents (id),
  body text not null,
  embedding extensions.vector(3),
  embedding_v2 extensions.vector(4),
  model_version_v2 text not null default 'embed-v2'
);

create index chunks_embedding_v1_idx
on app.chunks
using hnsw (embedding extensions.vector_cosine_ops);

create index chunks_embedding_v2_idx
on app.chunks
using hnsw (embedding_v2 extensions.vector_cosine_ops);

create table app.rag_jobs (
  id bigint generated always as identity primary key,
  document_id bigint not null references app.documents (id),
  target_model text not null,
  state text not null default 'queued'
);

create function app.search_catalog(query_text text)
returns table (
  item_id bigint,
  title text
)
language sql
stable
set search_path = pg_catalog, app
as $$
  select catalog_item.id, catalog_item.title
  from app.catalog_items as catalog_item
  where catalog_item.catalog_search_v2
    @@ plainto_tsquery('app.catalog_english'::regconfig, query_text)
  order by catalog_item.id
$$;
