insert into public.transition_anchor (label) values ('212');
insert into public.transition_view_source (amount) values (2), (3);
refresh materialized view public.transition_rollup;
