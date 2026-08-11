select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 235 and payload = 'case-235')
            from public.transition_anchor
          )
          and (
        exists (select 1 from pg_extension where extname = 'pg_graphql')
and has_table_privilege('authenticated', 'public.graphql_items_235', 'SELECT')
and has_table_privilege('anon', 'public.graphql_items_235', 'SELECT')
and (
  select jsonb_agg(to_jsonb(source_row) order by source_row.id)
  from public.graphql_items_235 source_row
) = '[{"id":1,"label":"GraphQL ACL row"}]'::jsonb
          )
        )::text;
