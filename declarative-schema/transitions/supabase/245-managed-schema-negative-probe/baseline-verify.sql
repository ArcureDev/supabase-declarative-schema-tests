select jsonb_build_object(
  'identity',
  'public.transition_anchor_245'::regclass::oid,
  'valid',
  (select count(*) = 1 and bool_and(payload = 'managed-negative-probe')
   from public.transition_anchor_245 where case_no = 245)
  and (select count(*) = 1 from public.managed_guard_245)
  and not exists (
    select 1 from pg_attribute
    where attrelid = 'public.managed_guard_245'::regclass
      and attname = 'hardened'
      and not attisdropped
  )
  and to_regclass('auth.ds_managed_negative_245') is null
  and (
    select auth_users_oid = 'auth.users'::regclass::oid
      and auth_schema_oid = (select oid from pg_namespace where nspname = 'auth')
    from public.managed_snapshot_245
    where id = 1
  )
)::text;
