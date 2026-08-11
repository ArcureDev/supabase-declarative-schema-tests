-- Invariant: helper replacement preserves table, function, trigger, and data identities.
insert into public.transition_anchor values (261, 'database-broadcast-helper');
alter table public.broadcast_orders_261 disable trigger broadcast_order_changes_261;
insert into public.broadcast_orders_261 values (1, 261, 'preserved');
alter table public.broadcast_orders_261 enable trigger broadcast_order_changes_261;
insert into public.broadcast_identity_261
select
  1,
  'public.broadcast_orders_261'::regclass::oid,
  'public.broadcast_order_changes_261()'::regprocedure::oid,
  (select oid from pg_trigger
   where tgrelid = 'public.broadcast_orders_261'::regclass
     and tgname = 'broadcast_order_changes_261');
