insert into public.transition_anchor values (1, 'preserved');
insert into public.partition_events values
  (1, '2024-05-01', 'eu', 'old-bound'),
  (2, '2025-02-01', 'eu', 'list-eu'),
  (3, '2025-03-01', 'us', 'list-default'),
  (4, '2023-05-01', 'eu', 'detach-me'),
  (5, '2027-05-01', 'eu', 'range-default');
