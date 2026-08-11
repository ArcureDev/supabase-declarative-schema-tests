-- Invariant: catalog ACLs and RLS expose behavior, never the private anchor.
select jsonb_build_object(
  'identity', 'api_281.coverage_anchor_281'::regclass::oid,
  'valid',
    (select count(*) = 1
              and bool_and(
                case_no = 281
                and payload = 'case-281'
                and private_value = 'PGDELTA_DATA_API_SECRET_281'
              )
     from api_281.coverage_anchor_281)
    and has_schema_privilege('anon', 'api_281', 'USAGE')
    and has_table_privilege(
          'anon', 'api_281.exposure_items_281', 'SELECT')
    and has_table_privilege(
          'anon', 'api_281.exposure_view_281', 'SELECT')
    and not has_table_privilege(
          'anon', 'api_281.exposure_items_281', 'INSERT')
    and not has_table_privilege(
          'anon', 'api_281.coverage_anchor_281', 'SELECT')
    and has_function_privilege(
          'anon', 'api_281.exposure_summary_281()', 'EXECUTE')
    and (
      select not procedure.prosecdef and procedure.provolatile = 's'
      from pg_proc procedure
      where procedure.oid = 'api_281.exposure_summary_281()'::regprocedure
    )
    and (
      select relrowsecurity
      from pg_class
      where oid = 'api_281.exposure_items_281'::regclass
    )
    and exists (
      select 1
      from pg_policy
      where polrelid = 'api_281.exposure_items_281'::regclass
        and polname = 'exposure_items_read_281'
        and pg_get_expr(polqual, polrelid) = 'published'
    )
    and coalesce((
      select 'security_invoker=true' = any(relation.reloptions)
      from pg_class relation
      where relation.oid = 'api_281.exposure_view_281'::regclass
        and relation.relkind = 'v'
    ), false)
    and (select count(*) = 2 from api_281.exposure_items_281)
)::text;
