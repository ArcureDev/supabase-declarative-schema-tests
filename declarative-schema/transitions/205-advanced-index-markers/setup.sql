insert into public.transition_anchor values (1, 'preserved');
insert into public.advanced_documents values
  (1, 'ext-a', 'alpha document', array['a','b'], point(1,2),
   '10.0.0.1', '2026-01-01 00:00:00+00'),
  (2, 'ext-b', 'beta document', array['b'], point(3,4),
   '2001:db8::1', '2026-02-01 00:00:00+00');
