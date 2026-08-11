select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select payload = 'existing'
     from public.batch_column_guard where id = 1)
    and not exists (
      select 1 from pg_attribute
      where attrelid = 'public.batch_column_guard'::regclass
        and attname in ('tags', 'metadata')
        and not attisdropped
    )
)::text;
