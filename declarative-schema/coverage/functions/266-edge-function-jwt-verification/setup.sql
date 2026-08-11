-- Invariant: the function case depends only on the isolated local runtime.
select jsonb_build_object(
  'valid',
  current_database() = 'postgres'
  and current_setting('server_version_num')::integer >= 150000
)::text;
