insert into public.transition_anchor (case_no, payload)
values (225, 'case-225');

insert into public.managed_probe_225 (id, snapshot)
values (
  1,
  jsonb_build_object(
    'auth.users', 'auth.users'::regclass::oid,
    'storage.objects', 'storage.objects'::regclass::oid,
    'realtime.messages', 'realtime.messages'::regclass::oid,
    'publication.supabase_realtime',
      (select oid from pg_publication where pubname = 'supabase_realtime')
  )
);
insert into public.boundary_app_225 (label)
values ('managed boundary row');
