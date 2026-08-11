select jsonb_build_object(
  'identity', 'public.webhook_events_263'::regclass::oid,
  'valid',
    exists (
      select 1
      from public.webhook_identity_263 identity
      join pg_trigger trigger_catalog on trigger_catalog.oid = identity.trigger_oid
      where identity.table_oid = 'public.webhook_events_263'::regclass::oid
        and identity.function_oid = 'public.dispatch_webhook_263()'::regprocedure::oid
        and pg_get_triggerdef(trigger_catalog.oid) ilike '%after insert on%'
        and pg_get_triggerdef(trigger_catalog.oid) not ilike '%update%'
    )
    and pg_get_functiondef('public.dispatch_webhook_263()'::regprocedure) ilike '%263-v1%'
    and (select count(*) = 1 from public.webhook_events_263)
)::text;
