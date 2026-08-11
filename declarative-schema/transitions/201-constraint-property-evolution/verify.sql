select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select count(*) = 3 and sum(amount) = 25
         and count(*) filter (where code is null) = 2
         from public.constraint_accounts)
    and exists (
      select 1 from pg_constraint
      where conrelid = 'public.constraint_accounts'::regclass
        and conname = 'constraint_accounts_pkey' and contype = 'p'
    )
    and exists (
      select 1 from pg_constraint
      where conrelid = 'public.constraint_accounts'::regclass
        and conname = 'constraint_accounts_tenant_code_key'
        and condeferrable and condeferred
        and pg_get_constraintdef(oid) ilike '%nulls not distinct%'
    )
    and exists (
      select 1 from pg_constraint
      where conrelid = 'public.constraint_accounts'::regclass
        and conname = 'constraint_accounts_amount_range'
        and pg_get_constraintdef(oid) ilike '%10000%'
    )
    and not exists (
      select 1 from pg_constraint
      where conrelid = 'public.constraint_accounts'::regclass
        and conname = 'constraint_accounts_amount_nonnegative'
    )
)::text;
