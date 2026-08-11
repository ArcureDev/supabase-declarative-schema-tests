select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    public.transition_compute(5) = 6
    and (
      select jsonb_agg(body order by id) = '["before"]'::jsonb
      from public.transition_call_log
    )
    and (
      select prokind = 'p'
      from pg_proc
      where oid = 'public.transition_record(text)'::regprocedure
    )
  )
)::text;
