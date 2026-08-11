do $$
begin
  if to_regclass('public.coverage_pgdelta_flag') is null then
    raise exception 'pg-delta flag table is missing';
  end if;
  if not exists (
    select 1
      from pg_attribute
     where attrelid = 'public.coverage_pgdelta_flag'::regclass
       and attname = 'normalized'
       and attgenerated = 's'
  ) then
    raise exception 'generated column was not applied';
  end if;
  if to_regclass('public.coverage_pgdelta_flag_normalized_idx') is null then
    raise exception 'covering index was not applied';
  end if;
end
$$;
