select audit.append_event(
  '2026-09-01',
  'release',
  '{"action":"v2"}'::jsonb
);

select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    select to_jsonb(anchor_row)
    from public.transition_anchor as anchor_row
    where anchor_row.id = 243
  ) = '{"id":243,"payload":"audit-ledger"}'::jsonb
  and (
    select
      count(*) = 3
      and bool_and(ledger_row.entry_hash is not null)
      and bool_and(ledger_row.source = 'api')
      and bool_and(ledger_row.request_id is not null)
    from audit.ledger as ledger_row
  )
  and not exists (
    select 1
    from (
      select
        ledger_row.previous_hash,
        lag(ledger_row.entry_hash) over (
          order by ledger_row.occurred_on, ledger_row.id
        ) as expected_previous_hash
      from audit.ledger as ledger_row
    ) as chain
    where chain.previous_hash is distinct from chain.expected_previous_hash
  )
  and to_regclass('audit.ledger_2026_09') is not null
  and to_regclass('audit.archived_ledger') is not null
  and exists (
    select 1
    from pg_event_trigger
    where evtname = 'ds_243_ddl_boundary'
      and evtenabled = 'O'
  )
  and has_function_privilege(
    'authenticated',
    'audit.append_event(date,text,jsonb)',
    'EXECUTE'
  )
  and not exists (
    select 1
    from pg_proc as routine
    cross join lateral aclexplode(
      coalesce(routine.proacl, acldefault('f', routine.proowner))
    ) as privilege
    where routine.oid = 'audit.append_event(date,text,jsonb)'::regprocedure
      and privilege.grantee = 0
      and privilege.privilege_type = 'EXECUTE'
  )
)::text;
