create sequence public.cycling_ticket_seq
  as integer
  minvalue 1
  maxvalue 100
  start with 1
  increment by 1
  cycle;
