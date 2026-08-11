select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 225 and payload = 'case-225')
            from public.transition_anchor
          )
          and (
        (
  select snapshot from public.managed_probe_225 where id = 1
) = jsonb_build_object(
  'auth.users', 'auth.users'::regclass::oid,
  'storage.objects', 'storage.objects'::regclass::oid,
  'realtime.messages', 'realtime.messages'::regclass::oid,
  'publication.supabase_realtime',
    (select oid from pg_publication where pubname = 'supabase_realtime')
)
and not exists (
  select 1 from pg_attribute
  where attrelid = 'public.boundary_app_225'::regclass
    and attname = 'note' and not attisdropped
)
and (select count(*) = 1 from public.boundary_app_225)
          )
        )::text;
