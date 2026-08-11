insert into public.transition_anchor_246 (case_no, payload)
values (246, 'managed-boundary-retention');

insert into public.managed_profile_246 (auth_user_id, alias)
values ('24600000-0000-0000-0000-000000000001', 'Boundary User');

insert into public.managed_snapshot_246 (
  id,
  auth_users_oid,
  storage_objects_oid,
  wrapper_oid
)
values (
  1,
  'auth.users'::regclass::oid,
  'storage.objects'::regclass::oid,
  'public.active_auth_user_246(uuid)'::regprocedure::oid
);
