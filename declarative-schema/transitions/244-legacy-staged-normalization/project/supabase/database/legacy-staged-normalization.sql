create schema if not exists legacy;
create schema if not exists app;

create extension if not exists hstore
with schema public;

create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table legacy."Customer" (
  "CustomerID" bigint primary key,
  "Full Name" text not null,
  "EmailAddress" text not null,
  "Preferences" public.hstore not null default ''::public.hstore
);

create table legacy.activity_base (
  id bigint primary key,
  customer_id bigint not null,
  occurred_at timestamptz not null
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
