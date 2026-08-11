select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    not coalesce(
      (select reloptions @> array['fillfactor=70']
       from pg_class where oid = 'public.storage_parameter_guard'::regclass),
      false
    )
    and (select payload = 'existing'
         from public.storage_parameter_guard where id = 1)
)::text;
