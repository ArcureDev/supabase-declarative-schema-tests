create table public.reservations (
  id bigint generated always as identity primary key,
  reserved_during tstzrange not null,
  constraint reservations_no_overlap
    exclude using gist (reserved_during with &&)
);
