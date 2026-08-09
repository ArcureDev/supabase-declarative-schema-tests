create table public.invoice_archive (
  id bigint not null,
  issued_on date not null,
  amount numeric(12, 2) not null,
  constraint invoice_archive_pkey primary key (id, issued_on)
) partition by range (issued_on);

create table public.invoice_archive_2023
partition of public.invoice_archive
for values from ('2023-01-01') to ('2024-01-01');
