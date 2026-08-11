select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and to_regnamespace('transition_app') is null
)::text;
