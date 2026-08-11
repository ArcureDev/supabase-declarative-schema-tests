select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select count(*) = 3 and sum(score) = 30
         from public.index_evolution)
    and to_regclass('public.index_evolution_code_old_idx') is not null
    and to_regclass('public.index_evolution_retired_idx') is null
    and exists (
      select 1
      from pg_index i
      join pg_class c on c.oid = i.indexrelid
      where i.indexrelid = 'public.index_evolution_lookup_idx'::regclass
        and i.indisunique
        and c.reloptions @> array['fillfactor=70']
        and pg_get_indexdef(i.indexrelid) ilike '%category text_pattern_ops%'
        and pg_get_indexdef(i.indexrelid) ilike '%lower(code)%'
        and pg_get_indexdef(i.indexrelid) ilike '%collate "C"%'
        and pg_get_indexdef(i.indexrelid) ilike '%desc nulls first%'
        and pg_get_indexdef(i.indexrelid) ilike '%include (score, payload)%'
        and pg_get_indexdef(i.indexrelid) ilike '%where%active%'
        and pg_get_indexdef(i.indexrelid) ilike '%score > 0%'
    )
    and exists (
      select 1
      from pg_index i
      join pg_class c on c.oid = i.indexrelid
      join pg_am a on a.oid = c.relam
      where i.indexrelid = 'public.index_evolution_hash_idx'::regclass
        and a.amname = 'hash'
    )
)::text;
