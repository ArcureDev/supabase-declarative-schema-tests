select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    select to_jsonb(anchor_row)
    from public.transition_anchor as anchor_row
    where anchor_row.id = 237
  ) = '{"id":237,"payload":"tenant-modular-graphql"}'::jsonb
  and (
    select membership.billing_role = 'collaborator'
    from tenant.memberships as membership
  )
  and (
    select summary.member_count = 1
    from api.organization_summary as summary
  )
  and tenant.custom_access_token_hook(
    '{"user_id":"23700000-0000-0000-0000-000000000002"}'::jsonb
  ) #>> '{claims,organization_roles,23700000-0000-0000-0000-000000000001}'
    = 'owner'
  and exists (
    select 1
    from pg_policy
    where polrelid = 'tenant.invitations'::regclass
      and polname = 'invitations_owner_manage'
      and pg_get_expr(polqual, polrelid) ilike '%member_role%owner%'
      and pg_get_expr(polwithcheck, polrelid) ilike '%member_role%owner%'
  )
  and has_table_privilege(
    'authenticated', 'tenant.invitations', 'INSERT'
  )
  and has_table_privilege(
    'authenticated', 'tenant.invitations', 'UPDATE'
  )
  and has_table_privilege(
    'authenticated', 'tenant.invitations', 'DELETE'
  )
)::text;
