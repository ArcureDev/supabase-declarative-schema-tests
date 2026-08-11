create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create sequence public.partition_attach_order_seq;

create table public.partition_attach_orders (
  id bigint not null default nextval('public.partition_attach_order_seq'),
  ordered_on date not null,
  customer_id bigint not null,
  payload text not null,
  constraint partition_attach_orders_pkey primary key (id, ordered_on)
) partition by range (ordered_on);

create index partition_attach_orders_customer_idx
  on public.partition_attach_orders (customer_id);

create function public.partition_attach_uppercase()
returns trigger language plpgsql as $$
begin
  new.payload := upper(new.payload);
  return new;
end
$$;

create trigger partition_attach_uppercase
before insert or update on public.partition_attach_orders
for each row execute function public.partition_attach_uppercase();

alter table public.partition_attach_orders enable row level security;
create policy partition_attach_open on public.partition_attach_orders
for all using (true) with check (true);

create table public.partition_attach_existing (
  id bigint not null default nextval('public.partition_attach_order_seq'),
  ordered_on date not null,
  customer_id bigint not null,
  payload text not null,
  constraint partition_attach_existing_pkey primary key (id, ordered_on),
  constraint partition_attach_existing_bound
    check (ordered_on >= date '2026-01-01'
       and ordered_on < date '2027-01-01')
);

create index partition_attach_existing_customer_idx
  on public.partition_attach_existing (customer_id);

create table public.partition_attach_refs (
  id bigint generated always as identity primary key,
  order_id bigint not null,
  ordered_on date not null,
  constraint partition_attach_refs_order_fk
    foreign key (order_id, ordered_on)
    references public.partition_attach_orders (id, ordered_on)
);

create publication partition_attach_publication
for table public.partition_attach_orders
with (publish_via_partition_root = true);

create table public.inherit_base_a (
  id bigint not null,
  payload text not null,
  constraint inherit_base_payload_check check (length(payload) > 0)
);
create table public.inherit_base_b (tag text not null);
create table public.inherit_multi_child (
  tag text not null,
  extra text
) inherits (public.inherit_base_a);
create table public.inherit_drop_child (
  extra text
) inherits (public.inherit_base_a, public.inherit_base_b);
