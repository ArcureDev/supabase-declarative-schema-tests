do $$
declare
  checkpoint_nullable boolean;
begin
  select not a.attnotnull
    into checkpoint_nullable
    from pg_attribute a
   where a.attrelid = 'public.coverage_recovery_contract'::regclass
     and a.attname = 'checkpoint'
     and not a.attisdropped;
  if checkpoint_nullable is distinct from false then
    raise exception 'checkpoint column remains nullable';
  end if;
  if not exists (
    select 1
      from pg_attribute
     where attrelid = 'public.coverage_recovery_contract'::regclass
       and attname = 'completed_at'
       and not attisdropped
  ) then
    raise exception 'recovery did not add completed_at';
  end if;
  if to_regclass('public.coverage_recovery_contract_payload_idx') is null then
    raise exception 'recovery did not add the payload index';
  end if;
end
$$;
