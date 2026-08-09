create table public.forced_rls_notes (
  id bigint generated always as identity primary key,
  body text not null
);

alter table public.forced_rls_notes enable row level security;
alter table public.forced_rls_notes force row level security;
