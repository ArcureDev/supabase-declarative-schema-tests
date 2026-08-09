create sequence public.fixture_bounded_ticket_seq
  as bigint
  minvalue 10
  maxvalue 10000
  start with 10
  increment by 2
  cache 50
  no cycle;
