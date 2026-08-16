select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (to_regclass('public.catalogue_partition_multilevel') is not null)
)::text;
