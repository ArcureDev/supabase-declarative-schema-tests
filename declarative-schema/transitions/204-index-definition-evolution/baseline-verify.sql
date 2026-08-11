select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select count(*) = 3 from public.index_evolution)
    and to_regclass('public.index_evolution_code_old_idx') is not null
    and exists (
      select 1 from pg_class
      where oid = 'public.index_evolution_lookup_idx'::regclass
        and reloptions @> array['fillfactor=80']
    )
)::text;
