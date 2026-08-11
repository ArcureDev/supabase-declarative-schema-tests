select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 228 and payload = 'case-228')
            from public.transition_anchor
          )
          and (
        (select relrowsecurity from pg_class where oid = 'realtime.messages'::regclass)
and exists (
  select 1 from pg_policy
  where polrelid = 'realtime.messages'::regclass
    and polname = 'transition_realtime_receive_228'
    and polcmd = 'r'
    and pg_get_expr(polqual, polrelid) ilike '%topic%'
    and pg_get_expr(polqual, polrelid) ilike '%uid%'
)
          )
        )::text;
