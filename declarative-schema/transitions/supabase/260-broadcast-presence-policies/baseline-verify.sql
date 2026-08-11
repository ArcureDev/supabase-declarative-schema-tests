select jsonb_build_object(
  'identity', 'realtime.messages'::regclass::oid,
  'valid',
    (select count(*) = 2 from public.realtime_policy_identity_260)
    and (
      select count(*) = 2
        and bool_and(identity.policy_oid = policy.oid)
        and bool_and(policy.polroles = array[(select oid from pg_roles where rolname = 'authenticated')]::oid[])
        and bool_and(pg_get_expr(coalesce(policy.polqual, policy.polwithcheck), policy.polrelid) ilike '%broadcast%')
        and bool_and(pg_get_expr(coalesce(policy.polqual, policy.polwithcheck), policy.polrelid) ilike '%presence%')
        and bool_and(pg_get_expr(coalesce(policy.polqual, policy.polwithcheck), policy.polrelid) not ilike '%team_id%')
      from public.realtime_policy_identity_260 identity
      join pg_policy policy on policy.oid = identity.policy_oid
    )
)::text;
