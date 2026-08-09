create table public.regional_announcements (
  id bigint not null,
  region_code text not null,
  message text not null,
  constraint regional_announcements_pkey primary key (id, region_code)
) partition by list (region_code);
