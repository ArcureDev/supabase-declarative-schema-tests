select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select relpersistence = 'p'
     from pg_class where oid = 'public.persistence_guard'::regclass)
    and (select payload = 'existing'
         from public.persistence_guard where id = 1)
)::text;
