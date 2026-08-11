insert into public.transition_anchor (id, payload)
values (243, 'audit-ledger');

select audit.append_event(
  '2026-08-10',
  'alice',
  '{"action":"create"}'::jsonb
);

select audit.append_event(
  '2026-08-11',
  'bob',
  '{"action":"approve"}'::jsonb
);
