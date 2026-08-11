create schema if not exists commerce;
create schema if not exists booking;
create schema if not exists billing;

create extension if not exists btree_gist with schema extensions;

create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create domain commerce.money
as numeric(12, 2)
check (value >= 0);

create table commerce.products (
  id bigint primary key,
  sku text not null unique,
  price commerce.money not null
);

create table commerce.inventory (
  product_id bigint primary key references commerce.products (id),
  available integer not null check (available >= 0)
);

create index inventory_low_stock_idx
on commerce.inventory (available, product_id)
where available < 10;

create table commerce.orders (
  id bigint generated always as identity primary key,
  state text not null default 'pending'
    check (state in ('pending', 'authorized', 'paid', 'cancelled')),
  created_at timestamptz not null default now()
);

create table commerce.order_lines (
  order_id bigint not null references commerce.orders (id),
  product_id bigint not null references commerce.products (id),
  quantity integer not null check (quantity > 0),
  unit_price commerce.money not null,
  line_total commerce.money generated always as
    (quantity * unit_price::numeric) stored,
  primary key (order_id, product_id)
);

create table booking.resources (
  id bigint primary key,
  name text not null
);

create table booking.reservations (
  id bigint primary key,
  resource_id bigint not null references booking.resources (id),
  slot tstzrange not null,
  timezone text not null default 'UTC',
  recurrence jsonb not null default '{}'::jsonb,
  constraint reservations_no_overlap
    exclude using gist (
      resource_id extensions.gist_int8_ops with =,
      slot with &&
    )
);

create table billing.secret_refs (
  name text primary key,
  secret_id uuid not null,
  rotated_at timestamptz
);

create table billing.payment_events (
  id bigint generated always as identity primary key,
  external_id text not null unique,
  payload jsonb not null,
  received_at timestamptz not null default now()
);

create table billing.payment_outbox (
  payment_event_id bigint primary key
    references billing.payment_events (id),
  state text not null default 'pending'
);

create table billing.sync_runs (
  id bigint generated always as identity primary key,
  requested_at timestamptz not null default now(),
  state text not null default 'queued'
);

create function billing.accept_payment(event jsonb)
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, billing
as $$
declare
  inserted_id bigint;
begin
  insert into billing.payment_events (external_id, payload)
  values (event ->> 'id', event)
  returning id into inserted_id;

  return inserted_id;
end
$$;

create function billing.stage_payment_event()
returns trigger
language plpgsql
set search_path = pg_catalog, billing
as $$
begin
  insert into billing.payment_outbox (payment_event_id)
  values (new.id);
  return new;
end
$$;

create trigger payment_event_stage
after insert on billing.payment_events
for each row
execute function billing.stage_payment_event();

create function billing.rotate_secret_reference(
  reference_name text,
  replacement_id uuid
)
returns void
language sql
security definer
set search_path = pg_catalog, billing
as $$
  update billing.secret_refs
  set
    secret_id = replacement_id,
    rotated_at = clock_timestamp()
  where name = reference_name
$$;

revoke all on function billing.accept_payment(jsonb)
from public, anon, authenticated;
revoke all on function billing.rotate_secret_reference(text, uuid)
from public, anon, authenticated;
grant usage on schema billing to service_role;
grant execute on function billing.accept_payment(jsonb) to service_role;
grant execute on function billing.rotate_secret_reference(text, uuid)
to service_role;

create foreign data wrapper ds_238_billing_fdw;

create server ds_238_billing_server
foreign data wrapper ds_238_billing_fdw;

create foreign table billing.remote_invoices (
  external_id text not null,
  amount commerce.money not null
)
server ds_238_billing_server;

alter table billing.payment_events enable row level security;

create policy payment_event_read
on billing.payment_events
for select
to authenticated
using (true);
