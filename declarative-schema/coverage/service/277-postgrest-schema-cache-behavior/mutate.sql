-- Invariant: explicit reload makes committed DDL visible to PostgREST.
alter table public.cache_items_277
  add column cache_marker text not null default 'reloaded-277';
notify pgrst, 'reload schema';
select pg_sleep(1);
select jsonb_build_object(
  'identity', 'public.cache_items_277'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(cache_marker = 'reloaded-277')
     from public.cache_items_277)
)::text;
