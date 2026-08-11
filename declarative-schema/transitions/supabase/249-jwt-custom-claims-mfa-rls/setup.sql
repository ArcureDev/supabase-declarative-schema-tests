insert into public.transition_anchor_249 (case_no, payload)
values (249, 'jwt-claims-mfa');

insert into public.protected_records_249 (owner_id, tenant_id, body)
values
  ('24900000-0000-0000-0000-000000000001', 'tenant-249-a', 'owned secret'),
  ('24900000-0000-0000-0000-000000000002', 'tenant-249-b', 'other secret');
