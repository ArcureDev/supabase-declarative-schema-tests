insert into public.transition_anchor_252 (case_no, payload)
values (252, 'auth-trigger-hardening');

insert into public.auth_trigger_snapshot_252 (id, function_oid, trigger_oid)
select
  1,
  'public.mirror_auth_user_252()'::regprocedure::oid,
  trigger_state.oid
from pg_trigger as trigger_state
where trigger_state.tgrelid = 'auth.users'::regclass
  and trigger_state.tgname = 'auth_profile_mirror_252'
  and not trigger_state.tgisinternal;

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  '25200000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'baseline-252@example.test',
  '',
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"Baseline 252"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);
