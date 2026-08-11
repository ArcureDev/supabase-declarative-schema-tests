begin;
delete from public.rls_probe_249;

set local role authenticated;
set local "request.jwt.claims" =
  '{"sub":"24900000-0000-0000-0000-000000000001","role":"authenticated","aal":"aal1","app_metadata":{"tenant_id":"tenant-249-a"}}';
insert into public.rls_probe_249
select 'aal1', count(*) from public.protected_records_249;
reset role;

select jsonb_build_object(
  'identity',
  'public.transition_anchor_249'::regclass::oid,
  'valid',
  (select count(*) = 1 and bool_and(payload = 'jwt-claims-mfa')
   from public.transition_anchor_249 where case_no = 249)
  and (select relrowsecurity from pg_class
       where oid = 'public.protected_records_249'::regclass)
  and has_table_privilege(
    'authenticated',
    'public.protected_records_249',
    'SELECT'
  )
  and exists (
    select 1
    from pg_policy
    where polrelid = 'public.protected_records_249'::regclass
      and polname = 'jwt_tenant_records_249'
      and pg_get_expr(polqual, polrelid) ilike '%uid%'
      and pg_get_expr(polqual, polrelid) ilike '%app_metadata%'
      and pg_get_expr(polqual, polrelid) not ilike '%aal%'
  )
  and (select visible_rows = 1 from public.rls_probe_249 where label = 'aal1')
)::text;
rollback;
