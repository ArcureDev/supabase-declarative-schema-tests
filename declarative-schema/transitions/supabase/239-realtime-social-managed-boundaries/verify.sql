select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    select to_jsonb(anchor_row)
    from public.transition_anchor as anchor_row
    where anchor_row.id = 239
  ) = '{"id":239,"payload":"realtime-social-managed"}'::jsonb
  and (select count(*) = 1 from app.messages)
  and (
    select relreplident = 'f'
    from pg_class
    where oid = 'app.messages'::regclass
  )
  and exists (
    select 1
    from pg_publication_rel
    where prpubid = (
      select oid
      from pg_publication
      where pubname = 'supabase_realtime'
    )
      and prrelid = 'app.messages'::regclass
  )
  and exists (
    select 1
    from pg_policy
    where polrelid = 'storage.objects'::regclass
      and polname = 'ds_239_storage_read'
  )
  and exists (
    select 1
    from pg_trigger
    where tgrelid = 'auth.users'::regclass
      and tgname = 'ds_239_auth_profile_mirror'
      and not tgisinternal
  )
  and exists (
    select 1
    from pg_trigger
    where tgrelid = 'app.messages'::regclass
      and tgname = 'ds_239_message_webhook'
      and not tgisinternal
  )
)::text;
