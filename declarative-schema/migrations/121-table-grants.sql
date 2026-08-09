create table public.grantable_documents (
  id bigint generated always as identity primary key,
  title text not null
);

grant select, insert on table public.grantable_documents to authenticated;
