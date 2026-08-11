select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select count(*) = 2 from public.constraint_attach)
    and exists (
      select 1 from pg_constraint
      where conrelid = 'public.constraint_attach'::regclass
        and conname = 'constraint_attach_external_key'
        and conindid = 'public.constraint_attach_external_key'::regclass
    )
    and to_regclass('public.constraint_attach_external_uidx') is null
    and exists (
      select 1 from pg_index
      where indexrelid = 'public.constraint_attach_retired_uidx'::regclass
        and indrelid = 'public.constraint_attach'::regclass
        and indisunique
        and pg_get_indexdef(indexrelid) ilike '%(retired_code)%'
    )
    and not exists (
      select 1 from pg_constraint
      where conrelid = 'public.constraint_attach'::regclass
        and conname = 'constraint_attach_retired_key'
    )
    and to_regclass('public.constraint_attach_search_old_idx') is not null
)::text;
