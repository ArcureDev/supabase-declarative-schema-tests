create table public.hash_shards (
  id bigint not null,
  payload text not null,
  constraint hash_shards_pkey primary key (id)
) partition by hash (id);
