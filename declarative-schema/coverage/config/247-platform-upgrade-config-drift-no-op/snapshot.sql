insert into public.config_anchor_247 (case_no, payload)
values (247, 'platform-config-no-op');

insert into public.config_snapshot_247 (
  id,
  anchor_oid,
  auth_users_oid,
  storage_objects_oid,
  server_major
)
values (
  1,
  'public.config_anchor_247'::regclass::oid,
  'auth.users'::regclass::oid,
  'storage.objects'::regclass::oid,
  current_setting('server_version_num')::integer / 10000
);
