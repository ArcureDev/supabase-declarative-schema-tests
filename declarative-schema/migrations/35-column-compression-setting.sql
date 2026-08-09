create table public.archived_documents (
  id bigint generated always as identity primary key,
  body text compression pglz not null
);
