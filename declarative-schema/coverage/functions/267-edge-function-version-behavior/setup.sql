-- Invariant: SQL records the version contract without deploying remotely.
create table public.function_version_contract_267 (
  version text primary key
);
insert into public.function_version_contract_267 values ('267-v1'), ('267-v2');
select jsonb_build_object(
  'valid',
  (select array_agg(version order by version) from public.function_version_contract_267)
    = array['267-v1', '267-v2']
)::text;
