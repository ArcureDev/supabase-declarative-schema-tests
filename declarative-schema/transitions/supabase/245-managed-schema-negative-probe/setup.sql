insert into public.transition_anchor_245 (case_no, payload)
values (245, 'managed-negative-probe');

insert into public.managed_guard_245 (label)
values ('application row');

insert into public.managed_snapshot_245 (id, auth_users_oid, auth_schema_oid)
select 1, 'auth.users'::regclass::oid, oid
from pg_namespace
where nspname = 'auth';
