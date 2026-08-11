-- Invariant: publication removal preserves the table OID and all rows.
insert into public.transition_anchor values (258, 'realtime-publication-removal');
insert into public.realtime_feed_258 (payload) values ('preserved-258');
