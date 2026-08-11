insert into public.transition_anchor values (1, 'preserved');
insert into public.constraint_parent values (1, 10, null), (1, 11, 10);
insert into public.constraint_codes values ('known');
insert into accounting.constraint_child
values (1, 1, 10, 1, 11, 'missing');
