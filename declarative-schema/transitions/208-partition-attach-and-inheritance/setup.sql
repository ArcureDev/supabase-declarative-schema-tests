insert into public.transition_anchor values (1, 'preserved');
insert into public.partition_attach_existing
  (ordered_on, customer_id, payload)
values ('2026-04-01', 7, 'keep');
insert into public.inherit_multi_child
values (10, 'multi', 'tag-a', 'extra-a');
insert into public.inherit_drop_child
values (20, 'drop', 'tag-b', 'extra-b');
