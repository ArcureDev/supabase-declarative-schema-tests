do $$
begin
  if to_regclass('public.coverage_reset_probe') is null then
    raise exception 'coverage_reset_probe is missing';
  end if;
  if (select count(*) from public.coverage_reset_probe) <> 1 then
    raise exception 'reset did not restore exactly one baseline row';
  end if;
  if not exists (
    select 1 from public.coverage_reset_probe
    where key = 'baseline' and value = 1
  ) then
    raise exception 'baseline row was not restored';
  end if;
end
$$;
