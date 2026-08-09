create table public.replica_identity_full_items (
  id bigint generated always as identity primary key,
  payload text not null
);

alter table public.replica_identity_full_items replica identity full;
