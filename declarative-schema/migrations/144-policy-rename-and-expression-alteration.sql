create table public.renamed_policy_notes (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  body text not null
);

alter table public.renamed_policy_notes enable row level security;

create policy "Temporary select policy"
on public.renamed_policy_notes
for select
to authenticated
using (true);

alter policy "Temporary select policy"
on public.renamed_policy_notes
rename to "Owners can select renamed policy notes";

alter policy "Owners can select renamed policy notes"
on public.renamed_policy_notes
to authenticated
using (owner_id = auth.uid());
