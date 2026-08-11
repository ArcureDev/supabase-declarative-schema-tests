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
  and exists (
    select 1
    from pg_policy
    where polrelid = 'app.messages'::regclass
      and polname = 'messages_member_read'
  )
)::text;
