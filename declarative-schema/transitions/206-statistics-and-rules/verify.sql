update public.stats_rule_source
set payload = 'changed'
where id = 1;

delete from public.stats_rule_source where id = 2;

select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (
      select count(*) = 1 and min(payload) = 'changed'
        and bool_and(touched_at is not null)
      from public.stats_rule_source
    )
    and (
      select array_agg(note order by note) =
        array['added:changed', 'rename:changed', 'replaced:beta']
      from public.stats_rule_audit
    )
    and not exists (
      select 1 from public.stats_rule_audit
      where note like 'enabled:%'
    )
    and exists (
      select 1 from pg_statistic_ext
      where stxname = 'stats_rename_old'
        and stxnamespace = 'public'::regnamespace
    )
    and exists (
      select 1 from pg_statistic_ext
      where stxname = 'stats_shape'
        and stxnamespace = 'public'::regnamespace
        and stxstattarget = 500
        and stxkind @> array['f','m']::"char"[]
    )
    and exists (
      select 1 from pg_statistic_ext
      where stxname = 'stats_move'
        and stxnamespace = 'analytics'::regnamespace
    )
    and exists (
      select 1 from pg_statistic_ext
      where stxname = 'stats_added'
        and stxnamespace = 'analytics'::regnamespace
    )
    and exists (
      select 1 from pg_statistic_ext
      where stxname = 'stats_owner'
        and pg_get_userbyid(stxowner) = 'postgres'
    )
    and not exists (
      select 1 from pg_statistic_ext
      where stxname = 'stats_retired'
    )
    and exists (
      select 1 from pg_rewrite
      where ev_class = 'public.stats_rule_source'::regclass
        and rulename = 'stats_rules_disabled' and ev_enabled = 'D'
    )
    and exists (
      select 1 from pg_rewrite
      where ev_class = 'public.stats_rule_source'::regclass
        and rulename = 'stats_rules_replace'
        and pg_get_ruledef(oid) ilike '%replaced:%'
    )
    and exists (
      select 1 from pg_rewrite
      where ev_class = 'public.stats_rule_source'::regclass
        and rulename = 'stats_rules_added'
    )
    and not exists (
      select 1 from pg_rewrite
      where ev_class = 'public.stats_rule_source'::regclass
        and rulename = 'stats_rules_retired'
    )
    and exists (
      select 1 from pg_policy
      where polrelid = 'public.stats_rule_source'::regclass
        and polname = 'stats_rule_open'
    )
    and (
      select relrowsecurity
      from pg_class
      where oid = 'public.stats_rule_source'::regclass
    )
)::text;
