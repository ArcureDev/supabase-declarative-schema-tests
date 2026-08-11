insert into public.transition_anchor (id, payload)
values (244, 'legacy-normalization');

insert into legacy."Customer" (
  "CustomerID",
  "Full Name",
  "EmailAddress",
  "Preferences"
)
values (
  1,
  'Ada Lovelace',
  'ADA@EXAMPLE.TEST',
  public.hstore('plan', 'legacy')
);

insert into legacy."ClickEvent" (
  id,
  customer_id,
  occurred_at,
  url
)
values (
  1,
  1,
  '2026-08-10 10:00+00',
  '/legacy'
);
