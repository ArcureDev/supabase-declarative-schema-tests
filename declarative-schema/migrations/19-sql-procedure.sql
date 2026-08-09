create table public.audit_messages (
  id bigint generated always as identity primary key,
  message text not null,
  created_at timestamptz not null default now()
);

create procedure public.record_audit_message(message text)
language sql
as $$
  insert into public.audit_messages (message) values (message);
$$;
