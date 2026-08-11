begin;
delete from public.rls_probe_250;

set local role authenticated;
set local "request.jwt.claims" =
  '{"sub":"25000000-0000-0000-0000-000000000001","role":"authenticated","is_anonymous":true}';
insert into public.rls_probe_250 (visible_rows)
select count(*) from public.anonymous_drafts_250;
reset role;

select jsonb_build_object(
  'identity',
  'public.transition_anchor_250'::regclass::oid,
  'valid',
  (select count(*) = 1 and bool_and(payload = 'anonymous-rls')
   from public.transition_anchor_250 where case_no = 250)
  and (select relrowsecurity from pg_class
       where oid = 'public.anonymous_drafts_250'::regclass)
  and (
    select count(*) = 2
      and bool_and(pg_get_expr(polqual, polrelid) ilike '%is_anonymous%')
    from pg_policy
    where polrelid = 'public.anonymous_drafts_250'::regclass
      and polname in (
        'registered_owned_drafts_250',
        'anonymous_owned_drafts_250'
      )
  )
  and has_table_privilege(
    'authenticated',
    'public.anonymous_drafts_250',
    'SELECT'
  )
  and (select visible_rows = 1 from public.rls_probe_250)
)::text;
rollback;
