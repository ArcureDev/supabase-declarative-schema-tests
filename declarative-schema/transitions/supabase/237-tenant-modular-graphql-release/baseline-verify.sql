select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    select to_jsonb(anchor_row)
    from public.transition_anchor as anchor_row
    where anchor_row.id = 237
  ) = '{"id":237,"payload":"tenant-modular-graphql"}'::jsonb
  and (select count(*) = 1 from api.organization_summary)
  and tenant.custom_access_token_hook(
    '{"user_id":"23700000-0000-0000-0000-000000000002"}'::jsonb
  ) #>> '{claims,tenant_release}' = 'v1'
  and has_function_privilege(
    'supabase_auth_admin',
    'tenant.custom_access_token_hook(jsonb)',
    'EXECUTE'
  )
)::text;
