select jsonb_build_object(
  'identity',
  (
    select oid
    from pg_policy
    where polrelid = 'storage.objects'::regclass
      and polname = 'transition_storage_insert_227'
  ),
  'valid',
  (
    select count(*) = 1
      and bool_and(
        case_no = 227
        and (payload::jsonb ->> 'objects_oid')::oid =
          'storage.objects'::regclass::oid
        and (payload::jsonb ->> 'policy_oid')::oid = (
          select oid
          from pg_policy
          where polrelid = 'storage.objects'::regclass
            and polname = 'transition_storage_insert_227'
        )
        and (payload::jsonb ->> 'objects_owner')::oid = (
          select relowner from pg_class where oid = 'storage.objects'::regclass
        )
        and payload::jsonb -> 'objects_acl' = (
          select coalesce(to_jsonb(relacl), 'null'::jsonb)
          from pg_class
          where oid = 'storage.objects'::regclass
        )
      )
    from public.transition_anchor
  )
  and (
    select relrowsecurity
    from pg_class
    where oid = 'storage.objects'::regclass
  )
  and (
    select count(*) = 1
      and bool_and(
        polcmd = 'a'
        and polpermissive
        and polroles = array[
          (select oid from pg_roles where rolname = 'authenticated')
        ]::oid[]
        and polqual is null
        and pg_get_expr(polwithcheck, polrelid) ilike '%transition-227%'
        and pg_get_expr(polwithcheck, polrelid) not ilike '%foldername%'
        and pg_get_expr(polwithcheck, polrelid) not ilike '%auth.jwt%'
      )
    from pg_policy
    where polrelid = 'storage.objects'::regclass
      and polname = 'transition_storage_insert_227'
  )
  and (
    select count(*) = 1
      and bool_and(
        id = 'transition-227'
        and name = 'transition-227'
        and not public
      )
    from storage.buckets
    where id = 'transition-227'
  )
)::text;
