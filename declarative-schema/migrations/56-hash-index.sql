create table public.lookup_keys (
  id bigint generated always as identity primary key,
  lookup_key text not null
);

create index lookup_keys_lookup_key_hash_idx
on public.lookup_keys using hash (lookup_key);
