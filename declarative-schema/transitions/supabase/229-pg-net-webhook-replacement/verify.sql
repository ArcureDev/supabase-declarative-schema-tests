select jsonb_build_object(
  'identity',
  'public.notify_transition_229()'::regprocedure::oid,
  'valid',
  (
    select count(*) = 1
      and bool_and(
        case_no = 229
        and (payload::jsonb ->> 'table_oid')::oid =
          'public.webhook_events_229'::regclass::oid
        and (payload::jsonb ->> 'function_oid')::oid =
          'public.notify_transition_229()'::regprocedure::oid
        and (payload::jsonb ->> 'trigger_oid')::oid = (
          select oid
          from pg_trigger
          where tgrelid = 'public.webhook_events_229'::regclass
            and tgname = 'transition_webhook_229'
            and not tgisinternal
        )
        and payload::jsonb -> 'function_acl' = (
          select coalesce(to_jsonb(proacl), 'null'::jsonb)
          from pg_proc
          where oid = 'public.notify_transition_229()'::regprocedure
        )
      )
    from public.transition_anchor
  )
  and (
    select prosecdef
      and provolatile = 'v'
      and prorettype = 'trigger'::regtype
      and language.lanname = 'plpgsql'
      and array_to_string(proconfig, ',') ilike '%search_path=%'
    from pg_proc as routine
    join pg_language as language on language.oid = routine.prolang
    where routine.oid = 'public.notify_transition_229()'::regprocedure
  )
  and pg_get_functiondef(
    'public.notify_transition_229()'::regprocedure
  ) ilike '%transition-229-v2%'
  and pg_get_functiondef(
    'public.notify_transition_229()'::regprocedure
  ) ilike '%timeout_milliseconds := 2000%'
  and exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.webhook_events_229'::regclass
      and tgname = 'transition_webhook_229'
      and tgfoid = 'public.notify_transition_229()'::regprocedure
      and tgtype = 5
      and tgenabled = 'O'
      and not tgisinternal
  )
  and (select count(*) = 0 from public.webhook_events_229)
)::text;
