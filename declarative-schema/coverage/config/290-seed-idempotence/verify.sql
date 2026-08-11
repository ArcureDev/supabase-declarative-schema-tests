do $$
begin
  if (select count(*) from public.coverage_reference_data) <> 1 then
    raise exception 'seed did not converge to exactly one row';
  end if;
  if not exists (
    select 1 from public.coverage_reference_data
    where key = 'primary' and label = 'Seeded reference' and revision = 1
  ) then
    raise exception 'seeded reference row is incorrect';
  end if;
end
$$;
