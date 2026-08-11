-- This runtime bucket is service data and must not become declarative DML.
insert into storage.buckets (id, name, public)
values ('transition-227', 'transition-227', false);

insert into public.transition_anchor (case_no, payload)
select
  227,
  jsonb_build_object(
    'objects_oid', objects.oid,
    'objects_owner', objects.relowner,
    'objects_acl', coalesce(to_jsonb(objects.relacl), 'null'::jsonb),
    'policy_oid', policy.oid
  )::text
from pg_class as objects
cross join pg_policy as policy
where objects.oid = 'storage.objects'::regclass
  and policy.polrelid = objects.oid
  and policy.polname = 'transition_storage_insert_227';
