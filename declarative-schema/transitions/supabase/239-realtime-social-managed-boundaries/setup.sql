insert into public.transition_anchor (id, payload)
values (239, 'realtime-social-managed');

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
