insert into public.storage_parameter_guard values (2, 'after');

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select reloptions @> array['fillfactor=70']
     from pg_class where oid = 'public.storage_parameter_guard'::regclass)
    and (select count(*) = 2 from public.storage_parameter_guard)
    and (select payload = 'preserved'
         from public.transition_anchor where id = 1)
)::text;
