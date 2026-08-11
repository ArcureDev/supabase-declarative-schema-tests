select jsonb_build_object(
  'identity', 'public.database_webhook_events_297'::regclass::oid,
  'valid',
    (
      select count(*) = 1
        and bool_and(
          case_no = 297
          and (payload::jsonb ->> 'table_oid')::oid =
            'public.database_webhook_events_297'::regclass::oid
          and (payload::jsonb ->> 'function_oid')::oid =
            'supabase_functions.http_request()'::regprocedure::oid
        )
      from public.transition_anchor
    )
    and not exists (
      select 1
      from pg_trigger
      where tgrelid = 'public.database_webhook_events_297'::regclass
        and tgname = 'database_webhook_297'
        and not tgisinternal
    )
    and (
      select jsonb_agg(to_jsonb(source_row) order by source_row.id)
      from public.database_webhook_events_297 as source_row
    ) = '[{"id":1,"payload":{"state":"preserved"}}]'::jsonb
)::text;
