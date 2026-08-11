-- Invariant: ALTER POLICY preserves OIDs while every command enforces caller ownership.
select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(payload = 'storage-policy-matrix')
     from public.transition_anchor where case_no = 255)
    and (
      select count(*) = 4
        and bool_and(identity.policy_oid = policy.oid)
        and bool_and(policy.polroles = array[(select oid from pg_roles where rolname = 'authenticated')]::oid[])
        and bool_and(pg_get_expr(coalesce(policy.polqual, policy.polwithcheck), policy.polrelid) ilike '%foldername%')
        and bool_and(pg_get_expr(coalesce(policy.polqual, policy.polwithcheck), policy.polrelid) ilike '%uid%')
      from public.storage_policy_identity_255 identity
      join pg_policy policy
        on policy.polname = identity.policy_name
       and policy.polrelid = 'storage.objects'::regclass
    )
    and (
      select jsonb_object_agg(polname, polcmd order by polname)
      from pg_policy
      where polrelid = 'storage.objects'::regclass
        and polname like 'storage_%_255'
    ) = '{"storage_delete_255":"d","storage_insert_255":"a","storage_select_255":"r","storage_update_255":"w"}'::jsonb
    and exists (
      select 1 from pg_policy
      where polrelid = 'storage.objects'::regclass
        and polname = 'storage_update_255'
        and polqual is not null
        and polwithcheck is not null
    )
)::text;
