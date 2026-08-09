create table public.jwt_claim_notes (
  id bigint generated always as identity primary key,
  tenant_id text not null,
  body text not null
);

alter table public.jwt_claim_notes enable row level security;

create policy "Users can select notes in their jwt tenant"
on public.jwt_claim_notes
for select
to authenticated
using (tenant_id = (auth.jwt() ->> 'tenant_id'));
