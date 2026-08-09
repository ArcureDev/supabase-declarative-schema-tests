create table public.tablespace_documents (
  id bigint generated always as identity primary key,
  title text not null
) tablespace pg_default;
