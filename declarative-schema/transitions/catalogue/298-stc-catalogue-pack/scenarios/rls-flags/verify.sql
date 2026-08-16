select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (to_regclass('public.catalogue_rls_flags') is not null)
)::text;
