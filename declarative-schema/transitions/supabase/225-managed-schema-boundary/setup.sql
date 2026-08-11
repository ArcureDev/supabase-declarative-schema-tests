insert into public.transition_anchor (case_no, payload)
values (
  225,
  jsonb_build_object(
    'boundary_oid', 'public.boundary_app_225'::regclass::oid,
    'probe_oid', 'public.managed_probe_225'::regclass::oid
  )::text
);

insert into public.managed_probe_225 (id, snapshot)
values (
  1,
  jsonb_build_object(
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
);
insert into public.boundary_app_225 (label)
values ('managed boundary row');
