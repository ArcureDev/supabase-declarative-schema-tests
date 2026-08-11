select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 222 and payload = 'case-222')
            from public.transition_anchor
          )
          and (
        not exists (
  select 1 from pg_collation
  where collname = 'transition_icu_222'
    and collnamespace = 'public'::regnamespace
)
and not exists (
  select 1 from pg_conversion
  where conname = 'transition_utf8_latin1_222'
    and connamespace = 'public'::regnamespace
)
          )
        )::text;
