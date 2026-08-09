create table public.replica_identity_default_items (
  id bigint generated always as identity primary key,
  payload text not null
);

alter table public.replica_identity_default_items replica identity default;
