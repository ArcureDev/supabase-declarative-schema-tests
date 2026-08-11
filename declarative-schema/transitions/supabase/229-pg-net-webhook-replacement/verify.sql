select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 229 and payload = 'case-229')
            from public.transition_anchor
          )
          and (
        pg_get_functiondef('public.notify_transition_229()'::regprocedure) ilike '%transition-229-v2%'
and pg_get_functiondef('public.notify_transition_229()'::regprocedure) ilike '%2000%'
and exists (
  select 1 from pg_trigger
  where tgrelid = 'public.webhook_events_229'::regclass
    and tgname = 'transition_webhook_229'
    and tgenabled = 'O' and not tgisinternal
)
          )
        )::text;
