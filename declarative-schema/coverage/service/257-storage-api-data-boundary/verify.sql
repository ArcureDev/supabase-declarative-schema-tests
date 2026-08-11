-- Invariant: the API-created object is visible in managed metadata exactly once.
select jsonb_build_object(
  'valid',
    (select count(*) = 1 from storage.objects
     where bucket_id = 'coverage-257' and name = 'runtime.txt')
    and exists (select 1 from storage.buckets where id = 'coverage-257' and not public)
)::text;
