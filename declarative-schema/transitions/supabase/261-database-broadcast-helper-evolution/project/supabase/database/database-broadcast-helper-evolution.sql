create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.broadcast_orders_261 (
  id bigint primary key,
  tenant_id integer not null,
  payload text not null
);

create table public.broadcast_identity_261 (
  id integer primary key,
  table_oid oid not null,
  function_oid oid not null,
  trigger_oid oid not null
);

create function public.broadcast_order_changes_261()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.broadcast_changes(
    'orders:' || coalesce(new.id, old.id)::text,
    tg_op,
    tg_op,
    tg_table_name,
    tg_table_schema,
    new,
    old
  );
  return null;
end;
$$;

create trigger broadcast_order_changes_261
after insert or update or delete on public.broadcast_orders_261
for each row execute function public.broadcast_order_changes_261();
