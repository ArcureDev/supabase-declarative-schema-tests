select jsonb_build_object(
  'identity',
  'app.messages'::regclass::oid,
  'valid',
  (
    select count(*) = 1
      and bool_and(
        id = 239
        and (payload::jsonb ->> 'profiles_oid')::oid =
          'app.profiles'::regclass::oid
        and (payload::jsonb ->> 'rooms_oid')::oid = 'app.rooms'::regclass::oid
        and (payload::jsonb ->> 'members_oid')::oid =
          'app.room_members'::regclass::oid
        and (payload::jsonb ->> 'messages_oid')::oid =
          'app.messages'::regclass::oid
        and (payload::jsonb ->> 'messages_policy_oid')::oid = (
          select oid
          from pg_policy
          where polrelid = 'app.messages'::regclass
            and polname = 'messages_member_read'
        )
        and (payload::jsonb ->> 'messages_owner')::oid = (
          select relowner from pg_class where oid = 'app.messages'::regclass
        )
        and payload::jsonb -> 'messages_acl' = (
          select coalesce(to_jsonb(relacl), 'null'::jsonb)
          from pg_class
          where oid = 'app.messages'::regclass
        )
        and (payload::jsonb ->> 'auth_users_oid')::oid =
          'auth.users'::regclass::oid
        and (payload::jsonb ->> 'auth_users_owner')::oid = (
          select relowner from pg_class where oid = 'auth.users'::regclass
        )
        and payload::jsonb -> 'auth_users_acl' = (
          select coalesce(to_jsonb(relacl), 'null'::jsonb)
          from pg_class
          where oid = 'auth.users'::regclass
        )
        and (payload::jsonb ->> 'auth_users_rls')::boolean = (
          select relrowsecurity from pg_class where oid = 'auth.users'::regclass
        )
        and (payload::jsonb ->> 'storage_objects_oid')::oid =
          'storage.objects'::regclass::oid
        and (payload::jsonb ->> 'storage_objects_owner')::oid = (
          select relowner from pg_class where oid = 'storage.objects'::regclass
        )
        and payload::jsonb -> 'storage_objects_acl' = (
          select coalesce(to_jsonb(relacl), 'null'::jsonb)
          from pg_class
          where oid = 'storage.objects'::regclass
        )
        and (payload::jsonb ->> 'storage_objects_rls')::boolean = (
          select relrowsecurity
          from pg_class
          where oid = 'storage.objects'::regclass
        )
        and (payload::jsonb ->> 'realtime_messages_oid')::oid =
          'realtime.messages'::regclass::oid
        and (payload::jsonb ->> 'realtime_messages_owner')::oid = (
          select relowner from pg_class where oid = 'realtime.messages'::regclass
        )
        and payload::jsonb -> 'realtime_messages_acl' = (
          select coalesce(to_jsonb(relacl), 'null'::jsonb)
          from pg_class
          where oid = 'realtime.messages'::regclass
        )
        and (payload::jsonb ->> 'realtime_messages_rls')::boolean = (
          select relrowsecurity
          from pg_class
          where oid = 'realtime.messages'::regclass
        )
        and payload::jsonb -> 'publication' = (
          select to_jsonb(publication)
          from pg_publication as publication
          where publication.pubname = 'supabase_realtime'
        )
      )
    from public.transition_anchor
  )
  and (
    select relrowsecurity and relreplident = 'd'
    from pg_class
    where oid = 'app.messages'::regclass
  )
  and (
    select count(*) = 1
      and bool_and(
        polcmd = 'r'
        and polpermissive
        and polroles = array[
          (select oid from pg_roles where rolname = 'authenticated')
        ]::oid[]
        and polwithcheck is null
        and pg_get_expr(polqual, polrelid) ilike '%room_members%'
        and pg_get_expr(polqual, polrelid) ilike '%auth.uid%'
      )
    from pg_policy
    where polrelid = 'app.messages'::regclass
      and polname = 'messages_member_read'
  )
  and not exists (
    select 1
    from pg_publication_rel as publication_relation
    join pg_publication as publication
      on publication.oid = publication_relation.prpubid
    where publication.pubname = 'supabase_realtime'
      and publication_relation.prrelid = 'app.messages'::regclass
  )
  and (
    select jsonb_agg(to_jsonb(source_row) order by source_row.auth_user_id)
    from app.profiles as source_row
  ) = '[{"auth_user_id":"23900000-0000-0000-0000-000000000001","handle":"alice","email":"a@example.test"}]'::jsonb
  and (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from app.rooms as source_row
  ) = '[{"id":1,"name":"General"}]'::jsonb
  and (
    select jsonb_agg(
      to_jsonb(source_row)
      order by source_row.room_id, source_row.auth_user_id
    )
    from app.room_members as source_row
  ) = '[{"room_id":1,"auth_user_id":"23900000-0000-0000-0000-000000000001"}]'::jsonb
  and (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from app.messages as source_row
  ) = '[{"id":1,"room_id":1,"author_id":"23900000-0000-0000-0000-000000000001","body":"hello","kind":"chat"}]'::jsonb
  and (
    select count(*) = 1
      and bool_and(id = 'chat-media' and name = 'chat-media' and not public)
    from storage.buckets
    where id = 'chat-media'
  )
  and to_regclass('app.attachments') is null
  and to_regclass('app.follows') is null
  and to_regclass('app.reactions') is null
  and to_regclass('app.notification_outbox') is null
  and not exists (
    select 1
    from pg_policy
    where polname in ('ds_239_storage_read', 'ds_239_realtime_send')
  )
  and not exists (
    select 1
    from pg_trigger
    where tgname in (
      'ds_239_auth_profile_mirror',
      'ds_239_message_webhook'
    )
      and not tgisinternal
  )
  and to_regprocedure('app.mirror_auth_user()') is null
  and to_regprocedure('app.dispatch_message_webhook()') is null
)::text;
