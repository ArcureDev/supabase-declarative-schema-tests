insert into public.dependency_source (raw_value)
values (7);

select jsonb_build_object(
  'table_oid',
  'public.dependency_source'::regclass::oid,
  'schema_valid',
  (
    to_regprocedure('public.dependency_scale(bigint)') is not null
    and (
      select bool_and(relation.relkind = 'v')
      from pg_class as relation
      where relation.oid = any (
        array[
          'public.dependency_base'::regclass,
          'public.dependency_left'::regclass,
          'public.dependency_right'::regclass,
          'public.dependency_leaf'::regclass
        ]
      )
    )
  ),
  'dependencies_valid',
  (
    exists (
      select 1
      from pg_rewrite as rewrite_rule
      join pg_depend as dependency
        on dependency.classid = 'pg_rewrite'::regclass
       and dependency.objid = rewrite_rule.oid
      where rewrite_rule.ev_class = 'public.dependency_base'::regclass
        and dependency.refclassid = 'pg_class'::regclass
        and dependency.refobjid = 'public.dependency_source'::regclass
    )
    and exists (
      select 1
      from pg_rewrite as rewrite_rule
      join pg_depend as dependency
        on dependency.classid = 'pg_rewrite'::regclass
       and dependency.objid = rewrite_rule.oid
      where rewrite_rule.ev_class = 'public.dependency_base'::regclass
        and dependency.refclassid = 'pg_proc'::regclass
        and dependency.refobjid = 'public.dependency_scale(bigint)'::regprocedure
    )
    and exists (
      select 1
      from pg_rewrite as rewrite_rule
      join pg_depend as dependency
        on dependency.classid = 'pg_rewrite'::regclass
       and dependency.objid = rewrite_rule.oid
      where rewrite_rule.ev_class = 'public.dependency_left'::regclass
        and dependency.refclassid = 'pg_class'::regclass
        and dependency.refobjid = 'public.dependency_base'::regclass
    )
    and exists (
      select 1
      from pg_rewrite as rewrite_rule
      join pg_depend as dependency
        on dependency.classid = 'pg_rewrite'::regclass
       and dependency.objid = rewrite_rule.oid
      where rewrite_rule.ev_class = 'public.dependency_right'::regclass
        and dependency.refclassid = 'pg_class'::regclass
        and dependency.refobjid = 'public.dependency_base'::regclass
    )
    and exists (
      select 1
      from pg_rewrite as rewrite_rule
      join pg_depend as dependency
        on dependency.classid = 'pg_rewrite'::regclass
       and dependency.objid = rewrite_rule.oid
      where rewrite_rule.ev_class = 'public.dependency_leaf'::regclass
        and dependency.refclassid = 'pg_class'::regclass
        and dependency.refobjid = 'public.dependency_left'::regclass
    )
    and exists (
      select 1
      from pg_rewrite as rewrite_rule
      join pg_depend as dependency
        on dependency.classid = 'pg_rewrite'::regclass
       and dependency.objid = rewrite_rule.oid
      where rewrite_rule.ev_class = 'public.dependency_leaf'::regclass
        and dependency.refclassid = 'pg_class'::regclass
        and dependency.refobjid = 'public.dependency_right'::regclass
    )
  ),
  'rows_valid',
  (
    select jsonb_agg(to_jsonb(result_row) order by result_row.id)
    from public.dependency_leaf as result_row
  ) = '[
    {
      "id": 1,
      "left_value": 21,
      "right_value": 19,
      "combined_value": 40
    },
    {
      "id": 2,
      "left_value": -5,
      "right_value": -7,
      "combined_value": -12
    },
    {
      "id": 3,
      "left_value": 15,
      "right_value": 13,
      "combined_value": 28
    }
  ]'::jsonb,
  'row_count',
  (select count(*) from public.dependency_source)
)::text;
