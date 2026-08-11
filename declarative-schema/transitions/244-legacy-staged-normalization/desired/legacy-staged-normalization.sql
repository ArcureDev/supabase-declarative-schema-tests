create schema if not exists extensions;
create schema if not exists legacy;
create schema if not exists app;

create extension if not exists hstore
with schema extensions;

create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table legacy."Customer" (
  "CustomerID" bigint primary key,
  "Full Name" text not null,
  "EmailAddress" text not null,
  "Preferences" extensions.hstore
    not null default ''::extensions.hstore,
  given_name text generated always as
    (split_part(trim("Full Name"), ' ', 1)) stored,
  family_name text generated always as
    (split_part(trim("Full Name"), ' ', 2)) stored,
  email_normalized text generated always as
    (lower("EmailAddress")) stored
);

create unique index customer_email_normalized_uidx
on legacy."Customer" (email_normalized);

alter table legacy."Customer" enable row level security;

create policy legacy_customer_read
on legacy."Customer"
for select
to authenticated
using (true);

create table legacy.activity_base (
  id bigint primary key,
  customer_id bigint not null,
  occurred_at timestamptz not null,
  source text not null default 'legacy'
);

create table legacy."ClickEvent" (
  url text not null
)
inherits (legacy.activity_base);

create view legacy."CustomerSummary"
as
select
  "CustomerID",
  "Full Name",
  "EmailAddress"
from legacy."Customer";

create function legacy."DisplayName"(customer_id bigint)
returns text
language sql
stable
set search_path = pg_catalog, legacy
as $$
  select customer."Full Name"
  from legacy."Customer" as customer
  where customer."CustomerID" = customer_id
$$;

create view app.customers
as
select
  customer."CustomerID" as id,
  customer."Full Name" as full_name,
  customer."EmailAddress" as email,
  customer.given_name,
  customer.family_name,
  customer.email_normalized
from legacy."Customer" as customer;

create function app.update_customer_compat()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, legacy, app
as $$
begin
  update legacy."Customer"
  set
    "Full Name" = new.full_name,
    "EmailAddress" = new.email
  where "CustomerID" = old.id;

  return new;
end
$$;

create trigger customers_dual_write
instead of update on app.customers
for each row
execute function app.update_customer_compat();

create view app.activity
as
select
  click_event.id,
  click_event.customer_id,
  click_event.occurred_at,
  click_event.source,
  click_event.url
from legacy."ClickEvent" as click_event;

create function app.customer_profile(customer_id bigint)
returns jsonb
language sql
stable
set search_path = pg_catalog, legacy
as $$
  select jsonb_build_object(
    'id',
    customer."CustomerID",
    'name',
    customer."Full Name",
    'email',
    customer."EmailAddress"
  )
  from legacy."Customer" as customer
  where customer."CustomerID" = customer_id
$$;
