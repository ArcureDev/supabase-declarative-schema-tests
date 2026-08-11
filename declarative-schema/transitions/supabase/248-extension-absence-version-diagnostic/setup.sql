insert into public.transition_anchor_248 (case_no, payload)
values (248, 'extension-version-diagnostic');

insert into public.extension_snapshot_248 (
  id,
  extension_oid,
  installed_version
)
select 1, oid, extversion
from pg_extension
where extname = 'hstore';
