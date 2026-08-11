select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select seqincrement = 1 and seqmin = 10 and seqmax = 100
            and seqcache = 1 and not seqcycle
     from pg_sequence
     where seqrelid = 'public.transition_ticket_seq'::regclass)
    and (select id = 10 and payload = 'existing'
         from public.sequence_option_guard)
)::text;
