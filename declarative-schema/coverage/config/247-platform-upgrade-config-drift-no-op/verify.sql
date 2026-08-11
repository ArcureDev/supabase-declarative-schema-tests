do $$
begin
  if not exists (
    select 1
    from public.config_snapshot_247
    where id = 1
      and anchor_oid = 'public.config_anchor_247'::regclass::oid
      and auth_users_oid = 'auth.users'::regclass::oid
      and storage_objects_oid = 'storage.objects'::regclass::oid
      and server_major = 17
      and current_setting('server_version_num')::integer / 10000 = 17
  ) then
    raise exception 'platform/config drift changed a captured identity or version';
  end if;

  if (
    select to_jsonb(anchor_row)
    from public.config_anchor_247 as anchor_row
    where case_no = 247
  ) <> '{"case_no":247,"payload":"platform-config-no-op"}'::jsonb then
    raise exception 'application anchor 247 changed during config no-op';
  end if;

  if obj_description('public.config_anchor_247'::regclass, 'pg_class')
      <> 'application object retained across platform config startup' then
    raise exception 'application metadata changed during config no-op';
  end if;
end
$$;
