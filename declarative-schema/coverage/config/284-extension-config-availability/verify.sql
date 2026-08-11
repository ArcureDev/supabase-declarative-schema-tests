do $$
declare
  extension_schema text;
begin
  select n.nspname
    into extension_schema
    from pg_extension e
    join pg_namespace n on n.oid = e.extnamespace
   where e.extname = 'pg_trgm';
  if extension_schema is distinct from 'extensions' then
    raise exception 'pg_trgm unavailable or installed in unexpected schema: %',
      extension_schema;
  end if;
  if to_regprocedure('extensions.similarity(text,text)') is null then
    raise exception 'pg_trgm similarity function is unavailable';
  end if;
end
$$;
