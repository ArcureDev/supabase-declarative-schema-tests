-- Invariant: dropping a queue removes both live and archive relations.
select pgmq.drop_queue('coverage_270');
select jsonb_build_object(
  'valid',
    to_regclass('pgmq.q_coverage_270') is null
    and to_regclass('pgmq.a_coverage_270') is null
)::text;
