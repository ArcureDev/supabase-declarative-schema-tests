-- Invariant: all extension versions, defaults, data, and ACLs are captured.
select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 280 and payload = 'case-280')
       from public.transition_anchor)
    and (select count(*) = 4 from public.extension_versions_280)
    and not exists (
      select 1
      from public.extension_versions_280 captured
      join pg_extension installed using (extname)
      where captured.extversion <> installed.extversion
         or installed.extnamespace <> 'extensions'::regnamespace
    )
    and (select count(*) = 2 and bool_and(id <> external_id)
         from public.extension_items_280)
    and public.normalize_label_280('Café Déjà') = 'Cafe Deja'
    and has_function_privilege(
          'authenticated', 'public.normalize_label_280(text)', 'EXECUTE')
    and not has_function_privilege(
          'anon', 'public.normalize_label_280(text)', 'EXECUTE')
    and to_regclass('public.transition_extension_trgm_280') is null
)::text;
