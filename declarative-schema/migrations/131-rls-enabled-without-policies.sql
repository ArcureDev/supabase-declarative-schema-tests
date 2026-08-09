create table public.rls_only_notes (
  id bigint generated always as identity primary key,
  body text not null
);

alter table public.rls_only_notes enable row level security;
