create schema if not exists extensions;
create schema if not exists app;

create extension if not exists pg_net
with schema extensions;

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

create table app.attachments (
  id bigint generated always as identity primary key,
  message_id bigint not null references app.messages (id),
  storage_bucket text not null,
  storage_path text not null,
  unique (storage_bucket, storage_path)
);

create table app.follows (
  follower_id uuid not null,
  followed_id uuid not null,
  primary key (follower_id, followed_id),
  check (follower_id <> followed_id)
);

create table app.reactions (
  message_id bigint not null references app.messages (id),
  actor_id uuid not null,
  emoji text not null,
  primary key (message_id, actor_id, emoji)
);

create table app.notification_outbox (
  id bigint generated always as identity primary key,
  message_id bigint not null references app.messages (id),
  secret_id uuid,
  state text not null default 'pending'
);

alter table app.messages enable row level security;
alter table app.messages replica identity full;

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

alter publication supabase_realtime
add table app.messages;

create policy ds_239_storage_read
on storage.objects
for select
to authenticated
using (bucket_id = 'chat-media');

create policy ds_239_realtime_send
on realtime.messages
for insert
to authenticated
with check (auth.uid() is not null);

create function app.mirror_auth_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, app
as $$
begin
  insert into app.profiles (auth_user_id, handle, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'handle', new.id::text),
    new.email
  )
  on conflict (auth_user_id)
  do update set email = excluded.email;

  return new;
end
$$;

create trigger ds_239_auth_profile_mirror
after insert or update on auth.users
for each row
execute function app.mirror_auth_user();

create function app.dispatch_message_webhook()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, app, net
as $$
begin
  perform net.http_post(
    url := 'http://127.0.0.1:1/ddl-boundary-only',
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := jsonb_build_object('message_id', new.id)
  );

  return new;
end
$$;

create trigger ds_239_message_webhook
after insert on app.messages
for each row
when (new.kind = 'webhook')
execute function app.dispatch_message_webhook();
