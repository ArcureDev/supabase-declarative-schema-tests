create sequence public.descending_ticket_seq
  as bigint
  start with 1000
  increment by -1
  minvalue 1
  maxvalue 1000
  no cycle;
