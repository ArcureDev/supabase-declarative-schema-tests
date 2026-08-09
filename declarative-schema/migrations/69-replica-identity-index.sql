create table public.replica_keyed_items (
  id bigint generated always as identity primary key,
  external_key text not null
);

create unique index replica_keyed_items_external_key_uidx
on public.replica_keyed_items (external_key);

alter table public.replica_keyed_items
  replica identity using index replica_keyed_items_external_key_uidx;
