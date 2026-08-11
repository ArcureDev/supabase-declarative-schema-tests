insert into public.transition_anchor (case_no, payload)
values (224, 'case-224');

alter user mapping for current_user
  server transition_server_224
  options (add password 'PGDELTA_SECRET_224');
