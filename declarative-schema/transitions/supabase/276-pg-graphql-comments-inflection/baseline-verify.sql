-- Invariant: baseline comments and ACLs are directly observable.
select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 276 and payload = 'case-276')
       from public.transition_anchor)
    and obj_description('public.graphql_notes_276'::regclass, 'pg_class')
          = 'case 276 baseline table'
    and col_description(
          'public.graphql_notes_276'::regclass,
          (select attnum from pg_attribute
           where attrelid = 'public.graphql_notes_276'::regclass
             and attname = 'label')
        ) = 'case 276 baseline label'
    and has_table_privilege('anon', 'public.graphql_notes_276', 'SELECT')
    and has_table_privilege('authenticated', 'public.graphql_notes_276', 'SELECT')
    and (select count(*) = 1 from public.graphql_notes_276)
)::text;
