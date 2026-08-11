-- Invariant: helper expansion changes behavior without widening execution rights.
select jsonb_build_object(
  'identity', 'public.storage_path_facts_256(text)'::regprocedure::oid,
  'valid',
    (select helper_oid = 'public.storage_path_facts_256(text)'::regprocedure::oid
     from public.storage_helper_probe_256 where id = 1)
    and (
      select public.storage_path_facts_256(object_name)
        = '{"filename":"avatar.final.png","extension":"png","folders":["private","user-256"],"level":2}'::jsonb
      from public.storage_helper_probe_256 where id = 1
    )
    and pg_get_functiondef('public.storage_path_facts_256(text)'::regprocedure) ilike '%storage.foldername%'
    and not has_function_privilege('anon', 'public.storage_path_facts_256(text)', 'EXECUTE')
    and has_function_privilege('authenticated', 'public.storage_path_facts_256(text)', 'EXECUTE')
    and exists (select 1 from public.transition_anchor where case_no = 256)
)::text;
