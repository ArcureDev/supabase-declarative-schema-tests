create table public.batched_messages (
  id bigint generated always as identity primary key,
  body text not null
);

create procedure public.insert_batched_message(message text)
language plpgsql
as $$
begin
  insert into public.batched_messages (body) values (message);
  commit;
  insert into public.batched_messages (body) values (message || ' confirmed');
end;
$$;
