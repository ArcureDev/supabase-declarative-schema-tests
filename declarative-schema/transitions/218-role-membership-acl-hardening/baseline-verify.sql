select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 218 and payload = 'case-218')
            from public.transition_anchor
          )
          and (
        exists (
  select 1 from pg_roles
  where rolname = 'transition_member_218'
    and rolconnlimit = -1 and not rolcanlogin and not rolbypassrls
)
and exists (
  select 1
  from pg_auth_members membership
  join pg_roles parent_role on parent_role.oid = membership.roleid
  join pg_roles member_role on member_role.oid = membership.member
  where parent_role.rolname = 'transition_parent_218'
    and member_role.rolname = 'transition_member_218'
    and not membership.admin_option
)
and has_table_privilege('transition_parent_218', 'public.role_acl_218', 'SELECT')
and not has_table_privilege('transition_parent_218', 'public.role_acl_218', 'UPDATE')
and (select relrowsecurity from pg_class where oid = 'public.role_acl_218'::regclass)
and exists (
  select 1 from pg_policy
  where polrelid = 'public.role_acl_218'::regclass
    and polname = 'transition_role_select_218'
)
and (select count(*) = 1 from public.role_acl_218)
          )
        )::text;
