with created_secret as (
  select vault.create_secret(
    'PGDELTA_VAULT_SECRET_230',
    'transition_230_token',
    'runtime-only transition secret'
  ) as secret_id
)
insert into public.transition_anchor (case_no, payload)
select
  230,
  jsonb_build_object(
    'function_oid', routine.oid,
    'function_acl', coalesce(to_jsonb(routine.proacl), 'null'::jsonb),
    'secret_id', created_secret.secret_id,
    'extension_oid', extension_catalog.oid
  )::text
from created_secret
cross join pg_proc as routine
cross join pg_extension as extension_catalog
where routine.oid = 'public.transition_vault_header_230()'::regprocedure
  and extension_catalog.extname = 'supabase_vault';
