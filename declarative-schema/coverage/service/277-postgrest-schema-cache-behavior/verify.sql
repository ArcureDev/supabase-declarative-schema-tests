-- Invariant: reload changes API metadata without changing data or ACLs.
select jsonb_build_object(
  'identity', 'public.cache_items_277'::regclass::oid,
  'valid',
    exists (
      select 1 from pg_attribute
      where attrelid = 'public.cache_items_277'::regclass
        and attname = 'cache_marker'
        and attnotnull
        and not attisdropped
    )
    and (select count(*) = 1 and bool_and(label = 'cache-row-277')
         from public.cache_items_277)
    and (select count(*) = 1
                  and bool_and(
                    case_no = 277
                    and private_value = 'PGDELTA_CACHE_SECRET_277'
                  )
         from public.cache_private_277)
    and has_table_privilege('anon', 'public.cache_items_277', 'SELECT')
    and not has_table_privilege('anon', 'public.cache_items_277', 'UPDATE')
    and not has_table_privilege('anon', 'public.cache_private_277', 'SELECT')
)::text;
