-- Invariant: service data and the fake secret are never schema migration DDL.
insert into api_281.coverage_anchor_281 (case_no, payload, private_value)
values (281, 'case-281', 'PGDELTA_DATA_API_SECRET_281');

insert into api_281.exposure_items_281 (label, published)
values ('visible-281', true), ('hidden-281', false);

select jsonb_build_object(
  'identity', 'api_281.coverage_anchor_281'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 281)
     from api_281.coverage_anchor_281)
    and (select count(*) = 2 from api_281.exposure_items_281)
)::text;
