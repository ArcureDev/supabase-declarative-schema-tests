insert into public.sequence_owner_guard (payload) values ('after');

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    exists (
      select 1
      from pg_depend d
      where d.classid = 'pg_class'::regclass
        and d.objid = 'public.transition_owned_seq'::regclass
        and d.refobjid = 'public.sequence_owner_guard'::regclass
        and d.refobjsubid = (
          select attnum from pg_attribute
          where attrelid = 'public.sequence_owner_guard'::regclass
            and attname = 'id'
        )
        and d.deptype = 'a'
    )
    and (select array_agg(id order by id) = array[100,101]::bigint[]
         from public.sequence_owner_guard)
)::text;
