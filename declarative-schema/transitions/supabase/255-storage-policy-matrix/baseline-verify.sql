-- Invariant: state A has one authenticated policy for each Storage command.
select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(payload = 'storage-policy-matrix')
     from public.transition_anchor where case_no = 255)
    and (select count(*) = 4 from public.storage_policy_identity_255)
    and (
      select count(*) = 4
        and bool_and(identity.policy_oid = policy.oid)
        and bool_and(policy.polroles = array[(select oid from pg_roles where rolname = 'authenticated')]::oid[])
        and bool_and(pg_get_expr(coalesce(policy.polqual, policy.polwithcheck), policy.polrelid) ilike '%matrix-255%')
        and bool_and(pg_get_expr(coalesce(policy.polqual, policy.polwithcheck), policy.polrelid) not ilike '%foldername%')
      from public.storage_policy_identity_255 identity
      join pg_policy policy
        on policy.polname = identity.policy_name
       and policy.polrelid = 'storage.objects'::regclass
    )
)::text;
