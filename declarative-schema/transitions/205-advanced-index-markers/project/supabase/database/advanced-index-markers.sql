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
