create table public.partitioned_private_notes (
  id bigint not null,
  recorded_on date not null,
  owner_id uuid not null,
  body text not null,
  constraint partitioned_private_notes_pkey primary key (id, recorded_on)
) partition by range (recorded_on);

alter table public.partitioned_private_notes enable row level security;

create policy "Owners can select partitioned private notes"
on public.partitioned_private_notes
for select
to authenticated
using (owner_id = auth.uid());
