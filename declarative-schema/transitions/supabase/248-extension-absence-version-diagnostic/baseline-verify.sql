select jsonb_build_object(
  'identity',
  'public.transition_anchor_248'::regclass::oid,
  'valid',
  (select count(*) = 1 and bool_and(payload = 'extension-version-diagnostic')
   from public.transition_anchor_248 where case_no = 248)
  and (
    select snapshot.extension_oid = extension_state.oid
      and snapshot.installed_version = extension_state.extversion
    from public.extension_snapshot_248 as snapshot
    join pg_extension as extension_state
      on extension_state.extname = 'hstore'
    where snapshot.id = 1
  )
  and not exists (
    select 1
    from pg_available_extension_versions
    where name = 'hstore'
      and version = '0.0.0-ds-missing-248'
  )
)::text;
