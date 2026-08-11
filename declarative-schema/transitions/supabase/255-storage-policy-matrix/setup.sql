-- Invariant: policy identity and representative data survive expression hardening.
insert into public.transition_anchor (case_no, payload)
values (255, 'storage-policy-matrix');

insert into public.storage_policy_identity_255 (policy_name, policy_oid)
select polname, oid
from pg_policy
where polrelid = 'storage.objects'::regclass
  and polname like 'storage_%_255';
