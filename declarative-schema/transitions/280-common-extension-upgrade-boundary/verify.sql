-- Invariant: application behavior changes while extension versions remain exact.
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
    and public.normalize_label_280('Café Déjà') = 'cafe deja'
    and has_function_privilege(
          'authenticated', 'public.normalize_label_280(text)', 'EXECUTE')
    and not has_function_privilege(
          'anon', 'public.normalize_label_280(text)', 'EXECUTE')
    and exists (
      select 1
      from pg_index index_state
      join pg_class index_relation on index_relation.oid = index_state.indexrelid
      join pg_am access_method on access_method.oid = index_relation.relam
      join pg_opclass operator_class on operator_class.oid = index_state.indclass[0]
      where index_state.indexrelid = 'public.transition_extension_trgm_280'::regclass
        and index_state.indisvalid
        and access_method.amname = 'gin'
        and operator_class.opcname = 'gin_trgm_ops'
    )
    and (
      select count(*) = 2
        and bool_and(label in ('Café Déjà', 'Cafe Delta'))
      from public.extension_items_280
    )
)::text;
