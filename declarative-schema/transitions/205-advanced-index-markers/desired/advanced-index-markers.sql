create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.advanced_documents (
  id bigint primary key,
  external_id text not null,
  body text not null,
  tags text[] not null,
  location point not null,
  network inet not null,
  recorded_at timestamptz not null
);

create unique index advanced_documents_external_uidx
  on public.advanced_documents (external_id);

create index advanced_documents_cluster_idx
  on public.advanced_documents (recorded_at, id);

create index advanced_documents_tags_gin_idx
  on public.advanced_documents using gin (tags);

create index advanced_documents_location_gist_idx
  on public.advanced_documents using gist (location);

create index advanced_documents_network_spgist_idx
  on public.advanced_documents using spgist (network inet_ops);

create index advanced_documents_recorded_brin_idx
  on public.advanced_documents using brin (recorded_at);

create index advanced_documents_body_trgm_a_idx
  on public.advanced_documents using gin (body extensions.gin_trgm_ops);

create index advanced_documents_body_trgm_b_idx
  on public.advanced_documents using gin (body extensions.gin_trgm_ops);

cluster public.advanced_documents using advanced_documents_cluster_idx;

alter table public.advanced_documents
  replica identity using index advanced_documents_external_uidx;
