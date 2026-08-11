select jsonb_build_object(
  'identity',
  'public.boundary_app_225'::regclass::oid,
  'valid',
  (
    select count(*) = 1
      and bool_and(
        case_no = 225
        and (payload::jsonb ->> 'boundary_oid')::oid =
          'public.boundary_app_225'::regclass::oid
        and (payload::jsonb ->> 'probe_oid')::oid =
          'public.managed_probe_225'::regclass::oid
      )
    from public.transition_anchor
  )
  -- The persisted snapshot makes managed identity and ACL checks cross-phase.
  and (
    select snapshot
    from public.managed_probe_225
    where id = 1
  ) = jsonb_build_object(
    'auth.users', (
      select jsonb_build_object(
        'oid', relation.oid,
        'owner', relation.relowner,
        'acl', coalesce(to_jsonb(relation.relacl), 'null'::jsonb),
        'rls', relation.relrowsecurity
      )
      from pg_class as relation
      where relation.oid = 'auth.users'::regclass
    ),
    'storage.objects', (
      select jsonb_build_object(
        'oid', relation.oid,
        'owner', relation.relowner,
        'acl', coalesce(to_jsonb(relation.relacl), 'null'::jsonb),
        'rls', relation.relrowsecurity
      )
      from pg_class as relation
      where relation.oid = 'storage.objects'::regclass
    ),
    'realtime.messages', (
      select jsonb_build_object(
        'oid', relation.oid,
        'owner', relation.relowner,
        'acl', coalesce(to_jsonb(relation.relacl), 'null'::jsonb),
        'rls', relation.relrowsecurity
      )
      from pg_class as relation
      where relation.oid = 'realtime.messages'::regclass
    ),
    'publication.supabase_realtime',
      (select to_jsonb(publication) from pg_publication as publication
       where publication.pubname = 'supabase_realtime')
  )
  and not exists (
    select 1
    from pg_attribute
    where attrelid = 'public.boundary_app_225'::regclass
      and attname = 'note'
      and not attisdropped
  )
  and (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from public.boundary_app_225 as source_row
  ) = '[{"id":1,"label":"managed boundary row"}]'::jsonb
)::text;
