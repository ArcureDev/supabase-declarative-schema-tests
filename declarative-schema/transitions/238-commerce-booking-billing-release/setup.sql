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
