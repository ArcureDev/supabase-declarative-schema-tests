select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select count(*) = 2 from public.stats_rule_source)
    and exists (
      select 1 from pg_statistic_ext
      where stxname = 'stats_rename_old'
        and stxnamespace = 'public'::regnamespace
    )
    and exists (
      select 1 from pg_rewrite
      where ev_class = 'public.stats_rule_source'::regclass
        and rulename = 'stats_rules_disabled' and ev_enabled = 'O'
    )
)::text;
