create table public.network_endpoints (
  id bigint generated always as identity primary key,
  address inet not null
);

create index network_endpoints_address_spgist_idx
on public.network_endpoints using spgist (address);
