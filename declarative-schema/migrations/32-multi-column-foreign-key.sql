create table public.regions (
  country_code text not null,
  region_code text not null,
  name text not null,
  constraint regions_pkey primary key (country_code, region_code)
);

create table public.warehouses (
  id bigint generated always as identity primary key,
  country_code text not null,
  region_code text not null,
  constraint warehouses_region_fkey
    foreign key (country_code, region_code)
    references public.regions (country_code, region_code)
);
