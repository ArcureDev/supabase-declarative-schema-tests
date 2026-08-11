create schema if not exists app;

create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table app.profiles (
  auth_user_id uuid primary key,
  handle text not null unique,
  email text
);

create table app.rooms (
  id bigint primary key,
  name text not null
);

create table app.room_members (
  room_id bigint not null references app.rooms (id),
  auth_user_id uuid not null,
  primary key (room_id, auth_user_id)
);

create table app.messages (
  id bigint generated always as identity primary key,
  room_id bigint not null references app.rooms (id),
  author_id uuid not null,
  body text not null,
  kind text not null default 'chat'
);

alter table app.messages enable row level security;

create policy messages_member_read
on app.messages
for select
to authenticated
using (
  exists (
    select 1
    from app.room_members as room_member
    where room_member.room_id = messages.room_id
      and room_member.auth_user_id = auth.uid()
  )
);
