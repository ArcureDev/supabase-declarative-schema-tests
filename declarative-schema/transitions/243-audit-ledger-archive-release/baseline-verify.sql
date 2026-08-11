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
      count(*) = 2
      and bool_and(ledger_row.entry_hash is not null)
    from audit.ledger as ledger_row
  )
  and exists (
    select 1
    from pg_trigger
    where tgrelid = 'audit.ledger'::regclass
      and tgname = 'ledger_append_only'
      and not tgisinternal
  )
)::text;
