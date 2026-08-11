insert into public.persistence_guard values (2, 'after');

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select relpersistence = 'u'
     from pg_class where oid = 'public.persistence_guard'::regclass)
    and (select array_agg(payload order by id) = array['existing','after']
         from public.persistence_guard)
    and (select payload = 'preserved'
         from public.transition_anchor where id = 1)
)::text;
