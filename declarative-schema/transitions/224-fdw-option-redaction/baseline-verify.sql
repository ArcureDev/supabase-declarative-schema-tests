select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 224 and payload = 'case-224')
            from public.transition_anchor
          )
          and (
        exists (
  select 1
  from pg_foreign_server server,
       lateral pg_options_to_table(server.srvoptions) option
  where server.srvname = 'transition_server_224'
    and option.option_name = 'host'
    and option.option_value = 'alpha.invalid'
)
and exists (
  select 1
  from pg_user_mappings mapping,
       lateral pg_options_to_table(mapping.umoptions) option
  where mapping.srvname = 'transition_server_224'
    and mapping.usename = current_user
    and option.option_name = 'password'
    and option.option_value = 'PGDELTA_SECRET_224'
)
          )
        )::text;
