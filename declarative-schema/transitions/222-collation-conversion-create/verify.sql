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
        exists (
  select 1 from pg_collation
  where collname = 'transition_icu_222'
    and collnamespace = 'public'::regnamespace
    and collprovider = 'i'
    and collisdeterministic
)
and exists (
  select 1 from pg_conversion
  where conname = 'transition_utf8_latin1_222'
    and connamespace = 'public'::regnamespace
    and pg_encoding_to_char(conforencoding) = 'UTF8'
    and pg_encoding_to_char(contoencoding) = 'LATIN1'
)
and ('a' collate public.transition_icu_222 < 'b' collate public.transition_icu_222)
          )
        )::text;
