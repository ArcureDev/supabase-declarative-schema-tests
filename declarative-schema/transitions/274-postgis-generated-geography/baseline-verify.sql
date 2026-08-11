-- Invariant: state A is populated and has no generated column.
select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 274 and payload = 'case-274')
       from public.transition_anchor)
    and not exists (
      select 1
      from pg_attribute
      where attrelid = 'public.generated_places_274'::regclass
        and attname = 'location'
        and not attisdropped
    )
    and (select count(*) = 2 from public.generated_places_274)
)::text;
