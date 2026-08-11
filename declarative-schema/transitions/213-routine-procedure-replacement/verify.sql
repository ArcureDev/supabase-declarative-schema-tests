call public.transition_record('after');

select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    public.transition_compute(5) = 7
    and (
      select jsonb_agg(body order by id) = '["before", "AFTER"]'::jsonb
      from public.transition_call_log
    )
    and (
      select prokind = 'f' and provolatile = 'i'
      from pg_proc
      where oid = 'public.transition_compute(integer)'::regprocedure
    )
    and (
      select prokind = 'p'
      from pg_proc
      where oid = 'public.transition_record(text)'::regprocedure
    )
  )
)::text;
