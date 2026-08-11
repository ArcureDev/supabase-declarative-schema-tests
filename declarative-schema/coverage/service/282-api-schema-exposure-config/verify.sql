-- A successful HTTP check is meaningful only after the intended ACL is present.
do $$
begin
  if to_regclass('coverage_api.exposed_items') is null then
    raise exception 'coverage_api.exposed_items is missing';
  end if;
  if not has_schema_privilege('anon', 'coverage_api', 'USAGE') then
    raise exception 'anon lacks USAGE on coverage_api';
  end if;
  if not has_table_privilege('anon', 'coverage_api.exposed_items', 'SELECT') then
    raise exception 'anon lacks SELECT on exposed_items';
  end if;
end
$$;
