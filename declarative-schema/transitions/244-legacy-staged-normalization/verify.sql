update app.customers
set
  full_name = 'Ada Byron',
  email = 'ADA.BYRON@EXAMPLE.TEST'
where id = 1;

select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    select to_jsonb(anchor_row)
    from public.transition_anchor as anchor_row
    where anchor_row.id = 244
  ) = '{"id":244,"payload":"legacy-normalization"}'::jsonb
  and legacy."DisplayName"(1) = 'Ada Byron'
  and (
    select
      customer.given_name = 'Ada'
      and customer.family_name = 'Byron'
      and customer.email_normalized = 'ada.byron@example.test'
    from legacy."Customer" as customer
    where customer."CustomerID" = 1
  )
  and (
    select click_event.source = 'legacy'
    from legacy."ClickEvent" as click_event
    where click_event.id = 1
  )
  and exists (
    select 1
    from pg_trigger
    where tgrelid = 'app.customers'::regclass
      and tgname = 'customers_dual_write'
      and not tgisinternal
  )
  and (
    select namespace.nspname = 'extensions'
    from pg_extension as extension
    join pg_namespace as namespace
      on namespace.oid = extension.extnamespace
    where extension.extname = 'hstore'
  )
)::text;
