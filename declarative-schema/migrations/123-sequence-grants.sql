create sequence public.grantable_ticket_seq;

grant usage, select on sequence public.grantable_ticket_seq to authenticated;
