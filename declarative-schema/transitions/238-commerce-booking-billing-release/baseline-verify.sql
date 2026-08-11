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
    select inventory.available = 4
    from commerce.inventory as inventory
    where inventory.product_id = 1
  )
  and (select count(*) = 2 from booking.reservations)
  and (select count(*) = 1 from billing.payment_events)
)::text;
