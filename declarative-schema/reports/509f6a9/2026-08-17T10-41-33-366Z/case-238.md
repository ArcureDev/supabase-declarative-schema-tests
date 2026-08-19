# Case: 238-commerce-booking-billing-release

## Baseline state A

```sql
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
```

## Desired state B

```sql
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
```

## Representative data setup

```sql
insert into public.transition_anchor (id, payload)
values (238, 'commerce-booking-billing');

insert into commerce.products (id, sku, price)
values (1, 'SKU-1', 19.95);

insert into commerce.inventory (product_id, available)
values (1, 4);

insert into booking.resources (id, name)
values (1, 'Studio');

insert into booking.reservations (id, resource_id, slot)
values
  (
    1,
    1,
    '[2026-08-10 09:00+00,2026-08-10 10:00+00)'::tstzrange
  ),
  (
    2,
    1,
    '[2026-08-10 10:00+00,2026-08-10 11:00+00)'::tstzrange
  );

insert into billing.secret_refs (name, secret_id)
values ('billing-api', '23800000-0000-0000-0000-000000000001');

select billing.accept_payment(
  '{"id":"evt-238","amount":19.95}'::jsonb
);
```

## CLI-generated baseline migration files

### `20260817213225_238_commerce_booking_billing_release_baseline.sql`

```sql
set local check_function_bodies = off;

create schema "billing";

create schema "booking";

create schema "commerce";

create table "billing"."payment_events" (
  "id"          bigint                   generated always as identity not null,
  "external_id" text                     not null,
  "payload"     jsonb                    not null,
  "received_at" timestamp with time zone not null default now(),
  constraint "payment_events_external_id_key" unique (external_id),
  constraint "payment_events_pkey" primary key (id)
);

create table "billing"."secret_refs" (
  "name"      text not null,
  "secret_id" uuid not null,
  constraint "secret_refs_pkey" primary key (name)
);

create table "booking"."reservations" (
  "id"          bigint    not null,
  "resource_id" bigint    not null,
  "slot"        tstzrange not null,
  constraint "reservations_pkey" primary key (id)
);

create table "booking"."resources" (
  "id"   bigint not null,
  "name" text   not null,
  constraint "resources_pkey" primary key (id)
);

create table "commerce"."inventory" (
  "product_id" bigint  not null,
  "available"  integer not null,
  constraint "inventory_available_check" check ((available >= 0)),
  constraint "inventory_pkey" primary key (product_id)
);

create table "commerce"."products" (
  "id"  bigint not null,
  "sku" text   not null,
  constraint "products_pkey" primary key (id),
  constraint "products_sku_key" unique (sku)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

create domain "commerce"."money" as numeric(12,2) constraint "money_check"
  check ((VALUE >= (0)::numeric));

alter table "commerce"."products"
  add column "price" commerce.money not null;

create or replace function billing.accept_payment (
  event jsonb
)
  returns bigint
  language plpgsql
  security definer
  set search_path to 'pg_catalog', 'billing'
  AS $function$
declare
  inserted_id bigint;
begin
  insert into billing.payment_events (external_id, payload)
  values (event ->> 'id', event)
  returning id into inserted_id;

  return inserted_id;
end
$function$;

alter table "booking"."reservations"
  add constraint "reservations_resource_id_fkey" foreign key (resource_id) references booking.resources(id);

alter table "commerce"."inventory"
  add constraint "inventory_product_id_fkey" foreign key (product_id) references commerce.products(id);

grant usage on type "commerce"."money" to "postgres";

grant execute on function "billing"."accept_payment"(jsonb) to "postgres";

grant create, usage on schema "billing" to "postgres";

grant create, usage on schema "booking" to "postgres";

grant create, usage on schema "commerce" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "billing"."payment_events" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "billing"."secret_refs" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "booking"."reservations" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "booking"."resources" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "commerce"."inventory" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "commerce"."products" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817213305_declarative_sync.sql`

```sql
set local check_function_bodies = off;

create extension "btree_gist" schema "extensions";

create foreign data wrapper "ds_238_billing_fdw";

create server "ds_238_billing_server"
  foreign data wrapper "ds_238_billing_fdw";

alter table "billing"."payment_events"
  enable row level security;

create table "billing"."payment_outbox" (
  "payment_event_id" bigint not null,
  "state"            text   not null default 'pending'::text,
  constraint "payment_outbox_pkey" primary key (payment_event_id)
);

create table "billing"."sync_runs" (
  "id"           bigint                   generated always as identity not null,
  "requested_at" timestamp with time zone not null default now(),
  "state"        text                     not null default 'queued'::text,
  constraint "sync_runs_pkey" primary key (id)
);

create table "commerce"."order_lines" (
  "order_id"   bigint         not null,
  "product_id" bigint         not null,
  "quantity"   integer        not null,
  "unit_price" commerce.money not null,
  constraint "order_lines_pkey" primary key (order_id, product_id),
  constraint "order_lines_quantity_check" check ((quantity > 0))
);

create table "commerce"."orders" (
  "id"         bigint                   generated always as identity not null,
  "state"      text                     not null default 'pending'::text,
  "created_at" timestamp with time zone not null default now(),
  constraint "orders_pkey" primary key (id),
  constraint "orders_state_check" check ((state = ANY (ARRAY['pending'::text, 'authorized'::text, 'paid'::text, 'cancelled'::text])))
);

alter table "billing"."secret_refs"
  add column "rotated_at" timestamp with time zone;

alter table "booking"."reservations"
  add column "timezone" text not null default 'UTC'::text;

alter table "booking"."reservations"
  add column "recurrence" jsonb not null default '{}'::jsonb;

alter table "commerce"."order_lines"
  add column "line_total" commerce.money generated always as (((quantity)::numeric * (unit_price)::numeric)) stored;

create foreign table "billing"."remote_invoices" () server "ds_238_billing_server";

alter table "billing"."remote_invoices"
  add column "external_id" text not null;

alter table "billing"."remote_invoices"
  add column "amount" commerce.money not null;

create or replace function billing.rotate_secret_reference (
  reference_name text,
  replacement_id uuid
)
  returns void
  language sql
  security definer
  set search_path to 'pg_catalog', 'billing'
  AS $function$
  update billing.secret_refs
  set
    secret_id = replacement_id,
    rotated_at = clock_timestamp()
  where name = reference_name
$function$;

create or replace function billing.stage_payment_event()
  returns trigger
  language plpgsql
  set search_path to 'pg_catalog', 'billing'
  AS $function$
begin
  insert into billing.payment_outbox (payment_event_id)
  values (new.id);
  return new;
end
$function$;

alter table "billing"."payment_outbox"
  add constraint "payment_outbox_payment_event_id_fkey" foreign key (payment_event_id) references billing.payment_events(id);

alter table "booking"."reservations"
  add constraint "reservations_no_overlap" EXCLUDE using gist (resource_id with =, slot with &&);

alter table "commerce"."order_lines"
  add constraint "order_lines_product_id_fkey" foreign key (product_id) references commerce.products(id);

alter table "commerce"."order_lines"
  add constraint "order_lines_order_id_fkey" foreign key (order_id) references commerce.orders(id);

create index inventory_low_stock_idx on commerce.inventory using btree (available, product_id)
  where (available < 10);

create trigger payment_event_stage
  after insert on billing.payment_events
  for each row
  execute function billing.stage_payment_event();

create policy "payment_event_read" on "billing"."payment_events"
  for select
  to "authenticated"
  using (true);

comment on extension "btree_gist" is 'support for indexing common datatypes in GiST';

grant delete, insert, maintain, references, select, trigger, truncate, update on table "billing"."remote_invoices" to "postgres";

revoke all on function "billing"."accept_payment"(jsonb) from public;

revoke all on function "billing"."accept_payment"(jsonb) from "service_role";

grant execute on function "billing"."accept_payment"(jsonb) to "service_role";

revoke all on function "billing"."rotate_secret_reference"(text, uuid) from public;

grant execute on function "billing"."rotate_secret_reference"(text, uuid) to "postgres", "service_role";

grant execute on function "billing"."stage_payment_event"() to "postgres";

revoke all on schema "billing" from "service_role";

grant usage on schema "billing" to "service_role";

grant usage on foreign server "ds_238_billing_server" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "billing"."payment_outbox" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "billing"."sync_runs" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "commerce"."order_lines" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "commerce"."orders" to "postgres";
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.1s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 238_commerce_booking_billing_release_baseline --debug`
- Result: **OK**
- Duration: `50.1s`

## Insert representative data

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Baseline state capture

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `40.2s`
<!-- declarative-schema-command-result case="238-commerce-booking-billing-release" engine="next" command="sync" status="OK" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **OK**
- Duration: `0.6s`

## Verify desired state B

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `49.9s`
<!-- declarative-schema-command-result case="238-commerce-booking-billing-release" engine="next" command="sync-verification" status="OK" -->

