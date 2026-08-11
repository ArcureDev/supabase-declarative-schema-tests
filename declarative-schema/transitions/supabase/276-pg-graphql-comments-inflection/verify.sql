-- Invariant: catalog directives drive the renamed GraphQL table and field.
with graph_result as (
  select graphql.resolve(
    query := $graphql$
      query {
        memo276Collection(first: 5) {
          edges { node { displayLabel } }
        }
      }
    $graphql$
  ) as payload
)
select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 276 and payload = 'case-276')
       from public.transition_anchor)
    and obj_description('public.graphql_notes_276'::regclass, 'pg_class')
          = '@graphql({"name": "Memo276"})'
    and col_description(
          'public.graphql_notes_276'::regclass,
          (select attnum from pg_attribute
           where attrelid = 'public.graphql_notes_276'::regclass
             and attname = 'label')
        ) = '@graphql({"name": "displayLabel"})'
    and has_table_privilege('anon', 'public.graphql_notes_276', 'SELECT')
    and has_table_privilege('authenticated', 'public.graphql_notes_276', 'SELECT')
    and (
      select payload #>> '{data,memo276Collection,edges,0,node,displayLabel}'
      from graph_result
    ) = 'GraphQL row 276'
    and (
      select not (payload ? 'errors')
      from graph_result
    )
)::text;
