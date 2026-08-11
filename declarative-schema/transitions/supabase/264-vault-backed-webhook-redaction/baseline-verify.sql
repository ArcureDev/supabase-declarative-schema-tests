select jsonb_build_object(
  'identity', 'public.vault_webhook_events_264'::regclass::oid,
  'valid',
    exists (
      select 1 from public.vault_webhook_identity_264 identity
      join pg_trigger trigger_catalog on trigger_catalog.oid = identity.trigger_oid
      where identity.table_oid = 'public.vault_webhook_events_264'::regclass::oid
        and identity.function_oid = 'public.dispatch_vault_webhook_264()'::regprocedure::oid
        and trigger_catalog.tgfoid = identity.function_oid
    )
    and (select count(*) = 1 from vault.secrets where name = 'webhook_264_token')
    and (select secret::text <> 'VAULT_WEBHOOK_SECRET_264'
         from vault.secrets where name = 'webhook_264_token')
    and pg_get_functiondef('public.dispatch_vault_webhook_264()'::regprocedure) ilike '%264-v1%'
    and pg_get_functiondef('public.dispatch_vault_webhook_264()'::regprocedure) not ilike '%VAULT_WEBHOOK_SECRET_264%'
    and not has_function_privilege('anon', 'public.dispatch_vault_webhook_264()', 'EXECUTE')
)::text;
