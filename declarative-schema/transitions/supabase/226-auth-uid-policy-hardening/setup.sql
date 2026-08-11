insert into public.transition_anchor (case_no, payload)
select
  226,
  jsonb_build_object(
    'table_oid', 'public.auth_documents_226'::regclass::oid,
    'policy_oid', policy.oid
  )::text
from pg_policy as policy
where policy.polrelid = 'public.auth_documents_226'::regclass
  and policy.polname = 'auth_owned_documents_226';

insert into public.auth_documents_226 (owner_id, body)
values ('00000000-0000-0000-0000-000000000226', 'preserved Auth row');
