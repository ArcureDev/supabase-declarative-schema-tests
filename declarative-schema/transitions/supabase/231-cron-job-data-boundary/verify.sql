select jsonb_build_object(
  'identity',
  'public.transition_cron_task_231()'::regprocedure::oid,
  'valid',
  (
    select count(*) = 1
      and bool_and(
        case_no = 231
        and (payload::jsonb ->> 'function_oid')::oid =
          'public.transition_cron_task_231()'::regprocedure::oid
        and (payload::jsonb ->> 'extension_oid')::oid = (
          select oid from pg_extension where extname = 'pg_cron'
        )
        and payload::jsonb -> 'function_acl' = (
          select coalesce(to_jsonb(proacl), 'null'::jsonb)
          from pg_proc
          where oid = 'public.transition_cron_task_231()'::regprocedure
        )
      )
    from public.transition_anchor
  )
  and (
    select not prosecdef
      and provolatile = 's'
      and prorettype = 'text'::regtype
      and language.lanname = 'sql'
      and array_to_string(proconfig, ',') ilike '%search_path=%'
    from pg_proc as routine
    join pg_language as language on language.oid = routine.prolang
    where routine.oid = 'public.transition_cron_task_231()'::regprocedure
  )
  and public.transition_cron_task_231() = 'v2'
  and (
    select count(*) = 1
      and bool_and(
        jobid = (
          select (payload::jsonb ->> 'job_id')::bigint
          from public.transition_anchor
          where case_no = 231
        )
        and schedule = '0 0 1 1 *'
        and command = 'select public.transition_cron_task_231()'
        and active
      )
    from cron.job
    where jobname = 'transition-231'
  )
)::text;
