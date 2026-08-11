-- Invariant: only the helper body evolves; no trigger or table replacement occurs.
select jsonb_build_object(
  'identity', 'public.broadcast_orders_261'::regclass::oid,
  'valid',
    exists (
      select 1 from public.broadcast_identity_261 identity
      join pg_trigger trigger_catalog on trigger_catalog.oid = identity.trigger_oid
      where identity.table_oid = 'public.broadcast_orders_261'::regclass::oid
        and identity.function_oid = 'public.broadcast_order_changes_261()'::regprocedure::oid
        and trigger_catalog.tgfoid = identity.function_oid
        and trigger_catalog.tgenabled = 'O'
        and not trigger_catalog.tgisinternal
    )
    and pg_get_functiondef('public.broadcast_order_changes_261()'::regprocedure) ilike '%tenant:%'
    and pg_get_functiondef('public.broadcast_order_changes_261()'::regprocedure) ilike '%lower(tg_op)%'
    and (select to_jsonb(source_row) from public.broadcast_orders_261 source_row where id = 1)
      = '{"id":1,"payload":"preserved","tenant_id":261}'::jsonb
)::text;
