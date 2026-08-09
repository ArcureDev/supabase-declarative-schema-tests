create sequence public.owned_ticket_seq;

create table public.owned_tickets (
  id bigint primary key default nextval('public.owned_ticket_seq'),
  label text not null
);

alter sequence public.owned_ticket_seq
  owned by public.owned_tickets.id;
