-- Invariant: the local diagnostic is stable, invoker-safe, and non-readable.
select jsonb_build_object(
  'identity', 'public.remote_runtime_279'::regclass::oid,
  'valid',
    exists (
      select 1
      from pg_proc procedure
      where procedure.oid = 'public.probe_remote_279()'::regprocedure
        and procedure.provolatile = 's'
        and not procedure.prosecdef
        and procedure.prosrc not like '%http%'
        and procedure.prosrc not like '%dblink%'
    )
    and has_function_privilege(
          'anon', 'public.probe_remote_279()', 'EXECUTE')
    and not has_table_privilege(
          'anon', 'public.remote_runtime_279', 'SELECT')
    and (select count(*) = 1 and bool_and(length(token) >= 8)
         from public.remote_runtime_279)
)::text;
