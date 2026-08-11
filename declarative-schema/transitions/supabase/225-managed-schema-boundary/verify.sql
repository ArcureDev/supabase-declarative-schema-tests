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
  -- Managed catalog rows must remain byte-for-byte equivalent to the snapshot.
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
  and exists (
    select 1
    from pg_attribute as attribute
    join pg_attrdef as attribute_default
      on attribute_default.adrelid = attribute.attrelid
     and attribute_default.adnum = attribute.attnum
    where attribute.attrelid = 'public.boundary_app_225'::regclass
      and attribute.attname = 'note'
      and not attribute.attisdropped
      and attribute.attnotnull
      and format_type(attribute.atttypid, attribute.atttypmod) = 'text'
      and pg_get_expr(
        attribute_default.adbin,
        attribute_default.adrelid
      ) = quote_literal('') || '::text'
  )
  and (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from public.boundary_app_225 as source_row
  ) = '[{"id":1,"label":"managed boundary row","note":""}]'::jsonb
)::text;
