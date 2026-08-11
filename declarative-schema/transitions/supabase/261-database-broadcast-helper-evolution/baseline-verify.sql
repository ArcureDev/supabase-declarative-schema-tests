select jsonb_build_object(
  'identity', 'public.broadcast_orders_261'::regclass::oid,
  'valid',
    exists (
      select 1 from public.broadcast_identity_261 identity
      join pg_trigger trigger_catalog on trigger_catalog.oid = identity.trigger_oid
      where identity.table_oid = 'public.broadcast_orders_261'::regclass::oid
        and identity.function_oid = 'public.broadcast_order_changes_261()'::regprocedure::oid
        and trigger_catalog.tgenabled = 'O'
    )
    and pg_get_functiondef('public.broadcast_order_changes_261()'::regprocedure) ilike '%orders:%'
    and pg_get_functiondef('public.broadcast_order_changes_261()'::regprocedure) not ilike '%tenant:%'
    and (select count(*) = 1 from public.broadcast_orders_261)
)::text;
