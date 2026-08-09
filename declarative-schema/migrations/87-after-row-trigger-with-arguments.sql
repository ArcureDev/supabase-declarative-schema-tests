create table public.audited_rows (
  id bigint generated always as identity primary key,
  body text not null
);

create table public.audited_row_events (
  id bigint generated always as identity primary key,
  source_label text not null,
  row_id bigint not null
);

create function public.record_audited_row_event()
returns trigger
language plpgsql
as $$
begin
  insert into public.audited_row_events (source_label, row_id)
  values (tg_argv[0], new.id);
  return null;
end;
$$;

create trigger audited_rows_after_insert
after insert on public.audited_rows
for each row
execute function public.record_audited_row_event('audited_rows');
