create table public.contacts (
  id bigint generated always as identity primary key,
  email text not null
);

create unique index contacts_lower_email_idx
on public.contacts (lower(email));
