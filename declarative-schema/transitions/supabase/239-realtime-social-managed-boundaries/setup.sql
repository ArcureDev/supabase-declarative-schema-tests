-- A managed-service row proves policy DDL does not rewrite Storage data.
insert into storage.buckets (id, name, public)
values ('chat-media', 'chat-media', false);

insert into public.transition_anchor (id, payload)
select
  239,
  jsonb_build_object(
    'profiles_oid', 'app.profiles'::regclass::oid,
    'rooms_oid', 'app.rooms'::regclass::oid,
    'members_oid', 'app.room_members'::regclass::oid,
    'messages_oid', app_messages.oid,
    'messages_owner', app_messages.relowner,
    'messages_acl', coalesce(to_jsonb(app_messages.relacl), 'null'::jsonb),
    'messages_policy_oid', baseline_policy.oid,
    'auth_users_oid', auth_users.oid,
    'auth_users_owner', auth_users.relowner,
    'auth_users_acl', coalesce(to_jsonb(auth_users.relacl), 'null'::jsonb),
    'auth_users_rls', auth_users.relrowsecurity,
    'storage_objects_oid', storage_objects.oid,
    'storage_objects_owner', storage_objects.relowner,
    'storage_objects_acl', coalesce(to_jsonb(storage_objects.relacl), 'null'::jsonb),
    'storage_objects_rls', storage_objects.relrowsecurity,
    'realtime_messages_oid', realtime_messages.oid,
    'realtime_messages_owner', realtime_messages.relowner,
    'realtime_messages_acl',
      coalesce(to_jsonb(realtime_messages.relacl), 'null'::jsonb),
    'realtime_messages_rls', realtime_messages.relrowsecurity,
    'publication', to_jsonb(realtime_publication)
  )::text
from pg_class as app_messages
cross join pg_policy as baseline_policy
cross join pg_class as auth_users
cross join pg_class as storage_objects
cross join pg_class as realtime_messages
cross join pg_publication as realtime_publication
where app_messages.oid = 'app.messages'::regclass
  and baseline_policy.polrelid = app_messages.oid
  and baseline_policy.polname = 'messages_member_read'
  and auth_users.oid = 'auth.users'::regclass
  and storage_objects.oid = 'storage.objects'::regclass
  and realtime_messages.oid = 'realtime.messages'::regclass
  and realtime_publication.pubname = 'supabase_realtime';

insert into app.profiles (auth_user_id, handle, email)
values (
  '23900000-0000-0000-0000-000000000001',
  'alice',
  'a@example.test'
);

insert into app.rooms (id, name)
values (1, 'General');

insert into app.room_members (room_id, auth_user_id)
values (1, '23900000-0000-0000-0000-000000000001');

insert into app.messages (room_id, author_id, body)
values (
  1,
  '23900000-0000-0000-0000-000000000001',
  'hello'
);
