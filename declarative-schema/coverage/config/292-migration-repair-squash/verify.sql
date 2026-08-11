do $$
begin
  if to_regclass('public.coverage_repair_probe') is null then
    raise exception 'repair probe table is missing';
  end if;
  if not exists (
    select 1
      from pg_attribute
     where attrelid = 'public.coverage_repair_probe'::regclass
       and attname = 'revision'
       and not attisdropped
  ) then
    raise exception 'repair probe revision column is missing';
  end if;
  if to_regclass('public.coverage_repair_probe_payload_idx') is null then
    raise exception 'repair probe index is missing';
  end if;
end
$$;
