select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    select to_jsonb(anchor_row)
    from public.transition_anchor as anchor_row
    where anchor_row.id = 238
  ) = '{"id":238,"payload":"commerce-booking-billing"}'::jsonb
  and (
    select count(*) = 2 and bool_and(reservation.timezone = 'UTC')
    from booking.reservations as reservation
  )
  and exists (
    select 1
    from pg_constraint
    where conrelid = 'booking.reservations'::regclass
      and conname = 'reservations_no_overlap'
      and contype = 'x'
      and pg_get_constraintdef(oid) ilike '%resource_id%with =%'
      and pg_get_constraintdef(oid) ilike '%slot%with &&%'
  )
  and to_regclass('commerce.order_lines') is not null
  and to_regclass('billing.remote_invoices') is not null
  and has_function_privilege(
    'service_role', 'billing.accept_payment(jsonb)', 'EXECUTE'
  )
  and not has_function_privilege(
    'authenticated', 'billing.accept_payment(jsonb)', 'EXECUTE'
  )
  and has_function_privilege(
    'service_role',
    'billing.rotate_secret_reference(text,uuid)',
    'EXECUTE'
  )
  and not has_function_privilege(
    'authenticated',
    'billing.rotate_secret_reference(text,uuid)',
    'EXECUTE'
  )
  and exists (
    select 1
    from pg_trigger
    where tgrelid = 'billing.payment_events'::regclass
      and tgname = 'payment_event_stage'
      and not tgisinternal
  )
)::text;
