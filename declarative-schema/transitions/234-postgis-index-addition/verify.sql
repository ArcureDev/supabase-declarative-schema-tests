select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 234 and payload = 'case-234')
            from public.transition_anchor
          )
          and (
        exists (
  select 1
  from pg_index index_state
  join pg_class index_relation on index_relation.oid = index_state.indexrelid
  join pg_am access_method on access_method.oid = index_relation.relam
  where index_state.indexrelid = 'public.transition_places_gist_234'::regclass
    and index_state.indisvalid
    and index_state.indisready
    and access_method.amname = 'gist'
)
and (
  select count(*) = 2
    and bool_and(extensions.st_srid(location::extensions.geometry) = 4326)
  from public.places_234
)
          )
        )::text;
