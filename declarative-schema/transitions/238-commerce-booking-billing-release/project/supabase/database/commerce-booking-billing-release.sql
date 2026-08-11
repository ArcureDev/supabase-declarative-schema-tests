create schema if not exists commerce;
create schema if not exists booking;
create schema if not exists billing;

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

create table booking.resources (
  id bigint primary key,
  name text not null
);

create table booking.reservations (
  id bigint primary key,
  resource_id bigint not null references booking.resources (id),
  slot tstzrange not null
);

create table billing.secret_refs (
  name text primary key,
  secret_id uuid not null
);

create table billing.payment_events (
  id bigint generated always as identity primary key,
  external_id text not null unique,
  payload jsonb not null,
  received_at timestamptz not null default now()
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
