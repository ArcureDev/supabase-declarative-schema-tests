-- Invariant: both message directions require an authenticated team claim.
select jsonb_build_object(
  'identity', 'realtime.messages'::regclass::oid,
  'valid',
    (
      select count(*) = 2
        and bool_and(identity.policy_oid = policy.oid)
        and bool_and(policy.polroles = array[(select oid from pg_roles where rolname = 'authenticated')]::oid[])
        and bool_and(pg_get_expr(coalesce(policy.polqual, policy.polwithcheck), policy.polrelid) ilike '%team_id%')
        and bool_and(pg_get_expr(coalesce(policy.polqual, policy.polwithcheck), policy.polrelid) ilike '%split_part%')
      from public.realtime_policy_identity_260 identity
      join pg_policy policy on policy.oid = identity.policy_oid
    )
    and exists (
      select 1 from pg_policy
      where polrelid = 'realtime.messages'::regclass
        and polname = 'realtime_receive_260'
        and polcmd = 'r'
        and polqual is not null
    )
    and exists (
      select 1 from pg_policy
      where polrelid = 'realtime.messages'::regclass
        and polname = 'realtime_send_260'
        and polcmd = 'a'
        and polwithcheck is not null
    )
    and exists (select 1 from public.transition_anchor where case_no = 260)
)::text;
