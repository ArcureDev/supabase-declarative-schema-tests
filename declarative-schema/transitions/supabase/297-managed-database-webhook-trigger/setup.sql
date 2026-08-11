insert into public.transition_anchor (case_no, payload)
values (
  297,
  jsonb_build_object(
    'table_oid', 'public.database_webhook_events_297'::regclass::oid,
    'function_oid', 'supabase_functions.http_request()'::regprocedure::oid
  )::text
);

insert into public.database_webhook_events_297 (payload)
values ('{"state":"preserved"}');
