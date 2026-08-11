-- Invariant: state A uses a valid four-list IVFFlat cosine index.
select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 273 and payload = 'case-273')
       from public.transition_anchor)
    and exists (
      select 1
      from pg_index index_state
      join pg_class index_relation on index_relation.oid = index_state.indexrelid
      join pg_am access_method on access_method.oid = index_relation.relam
      join pg_opclass operator_class on operator_class.oid = index_state.indclass[0]
      where index_state.indexrelid = 'public.transition_vector_ivfflat_273'::regclass
        and index_state.indisvalid
        and access_method.amname = 'ivfflat'
        and operator_class.opcname = 'vector_cosine_ops'
        and index_relation.reloptions @> array['lists=4']
    )
    and (select count(*) = 3 from public.vector_ivfflat_items_273)
)::text;
