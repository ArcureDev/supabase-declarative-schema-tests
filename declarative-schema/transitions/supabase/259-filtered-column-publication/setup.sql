-- Invariant: publication filtering changes replication metadata, never source data.
insert into public.transition_anchor values (259, 'filtered-column-publication');
insert into public.realtime_filtered_259 values
  (1, 7, 'included'),
  (2, 0, 'filtered-but-preserved');
