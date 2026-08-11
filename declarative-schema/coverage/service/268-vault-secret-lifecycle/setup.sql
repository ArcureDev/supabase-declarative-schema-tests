-- Invariant: only encrypted storage and redacted metadata cross the service boundary.
create extension if not exists supabase_vault with schema vault;
select vault.create_secret(
  'VAULT_COVERAGE_SECRET_268_ALPHA',
  'coverage_268_token',
  'created-v1'
);

create function public.vault_probe_268()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select pg_catalog.jsonb_build_object(
    'name', name,
    'description', description,
    'secret_visible', false
  )
  from vault.secrets
  where name = 'coverage_268_token'
$$;

revoke execute on function public.vault_probe_268()
from public, anon, authenticated;
grant execute on function public.vault_probe_268()
to service_role;
notify pgrst, 'reload schema';
select pg_sleep(1);

select jsonb_build_object(
  'valid',
    (select count(*) = 1 from vault.secrets where name = 'coverage_268_token')
    and (select secret::text <> 'VAULT_COVERAGE_SECRET_268_ALPHA'
         from vault.secrets where name = 'coverage_268_token')
    and not has_function_privilege('anon', 'public.vault_probe_268()', 'EXECUTE')
)::text;
