select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select count(*) = 2 from public.constraint_attach)
    and to_regclass('public.constraint_attach_external_uidx') is not null
    and not exists (
      select 1 from pg_constraint
      where conindid = 'public.constraint_attach_external_uidx'::regclass
    )
    and exists (
      select 1 from pg_constraint
      where conrelid = 'public.constraint_attach'::regclass
        and conname = 'constraint_attach_retired_key'
    )
)::text;
