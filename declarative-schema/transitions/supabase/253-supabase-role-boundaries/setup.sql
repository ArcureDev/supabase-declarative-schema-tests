insert into public.transition_anchor_253 (case_no, payload)
values (253, 'supabase-role-boundaries');

insert into public.role_boundary_253 (visibility, body)
values
  ('public', 'visible through authenticated RLS'),
  ('private', 'service role only');
