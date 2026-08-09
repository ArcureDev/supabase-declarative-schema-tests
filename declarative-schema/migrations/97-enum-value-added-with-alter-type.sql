create type public.delivery_status as enum (
  'queued',
  'shipped'
);

alter type public.delivery_status add value 'delivered' after 'shipped';
