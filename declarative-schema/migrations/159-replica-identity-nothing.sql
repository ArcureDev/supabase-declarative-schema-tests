create table public.replica_identity_nothing_items (
  id bigint generated always as identity primary key,
  payload text not null
);

alter table public.replica_identity_nothing_items replica identity nothing;
