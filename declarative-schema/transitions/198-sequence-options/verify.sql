insert into public.sequence_option_guard (payload) values ('after');

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select seqincrement = 5 and seqmin = 5 and seqmax = 1000
            and seqcache = 20 and seqcycle
     from pg_sequence
     where seqrelid = 'public.transition_ticket_seq'::regclass)
    and (select array_agg(id order by id) = array[10,15]::bigint[]
         from public.sequence_option_guard)
)::text;
