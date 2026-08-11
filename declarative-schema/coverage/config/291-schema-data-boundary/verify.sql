do $$
begin
  if to_regclass('public.coverage_schema_data') is null then
    raise exception 'declarative table is missing';
  end if;
  if (select count(*) from public.coverage_schema_data) <> 1 then
    raise exception 'declarative sync changed runtime row count';
  end if;
  if not exists (
    select 1 from public.coverage_schema_data
    where id = 1 and payload = 'runtime-data'
  ) then
    raise exception 'runtime data was not preserved';
  end if;
end
$$;
