create table public.tagged_documents (
  id bigint generated always as identity primary key,
  tags text[] not null
);

create index tagged_documents_tags_gin_idx
on public.tagged_documents using gin (tags);
