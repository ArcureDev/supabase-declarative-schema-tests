-- Invariant: trigger recreation is isolated; table/function OIDs and data survive.
select jsonb_build_object(
  'identity', 'public.webhook_events_263'::regclass::oid,
  'valid',
    exists (
      select 1
      from public.webhook_identity_263 identity
      join pg_trigger trigger_catalog
        on trigger_catalog.tgrelid = identity.table_oid
       and trigger_catalog.tgname = 'webhook_lifecycle_263'
      where identity.table_oid = 'public.webhook_events_263'::regclass::oid
        and identity.function_oid = 'public.dispatch_webhook_263()'::regprocedure::oid
        and trigger_catalog.oid <> identity.trigger_oid
        and trigger_catalog.tgfoid = identity.function_oid
        and pg_get_triggerdef(trigger_catalog.oid) ilike '%after insert or update%'
        and pg_get_triggerdef(trigger_catalog.oid) ilike '%new.deliver%'
    )
    and pg_get_functiondef('public.dispatch_webhook_263()'::regprocedure) ilike '%263-v2%'
    and pg_get_functiondef('public.dispatch_webhook_263()'::regprocedure) ilike '%500%'
    and (select to_jsonb(source_row) from public.webhook_events_263 source_row where id = 1)
      = '{"id":1,"deliver":true,"payload":"preserved"}'::jsonb
)::text;
