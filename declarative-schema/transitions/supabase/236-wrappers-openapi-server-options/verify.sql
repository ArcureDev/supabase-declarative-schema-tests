select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 236 and payload = 'case-236')
            from public.transition_anchor
          )
          and (
        exists (
  select 1 from pg_foreign_data_wrapper
  where fdwname = 'transition_openapi_wrapper_236'
    and fdwhandler = 'extensions.wasm_fdw_handler()'::regprocedure
    and fdwvalidator = 'extensions.wasm_fdw_validator(text[],oid)'::regprocedure
)
and exists (
  select 1
  from pg_foreign_server server,
       lateral pg_options_to_table(server.srvoptions) option
  where server.srvname = 'transition_openapi_server_236'
    and option.option_name = 'base_url'
    and option.option_value = 'https://api.invalid/v2'
)
          )
        )::text;
