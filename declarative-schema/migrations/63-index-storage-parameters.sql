create table public.dense_keys (
  id bigint generated always as identity primary key,
  key text not null
);

create index dense_keys_key_idx
on public.dense_keys (key)
with (fillfactor = 70);
