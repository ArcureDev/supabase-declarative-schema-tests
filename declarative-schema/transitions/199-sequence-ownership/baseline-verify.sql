select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    not exists (
      select 1
      from pg_depend d
      where d.classid = 'pg_class'::regclass
        and d.objid = 'public.transition_owned_seq'::regclass
        and d.refobjid = 'public.sequence_owner_guard'::regclass
        and d.deptype = 'a'
    )
    and (select id = 100 and payload = 'existing'
         from public.sequence_owner_guard)
)::text;
