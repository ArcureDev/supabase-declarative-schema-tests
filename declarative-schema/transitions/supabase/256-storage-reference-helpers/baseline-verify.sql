select jsonb_build_object(
  'identity', 'public.storage_path_facts_256(text)'::regprocedure::oid,
  'valid',
    (select helper_oid = 'public.storage_path_facts_256(text)'::regprocedure::oid
     from public.storage_helper_probe_256 where id = 1)
    and (
      select public.storage_path_facts_256(object_name)
        = '{"filename":"avatar.final.png","extension":"png"}'::jsonb
      from public.storage_helper_probe_256 where id = 1
    )
    and not has_function_privilege('anon', 'public.storage_path_facts_256(text)', 'EXECUTE')
    and has_function_privilege('authenticated', 'public.storage_path_facts_256(text)', 'EXECUTE')
)::text;
