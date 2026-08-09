create table public.member_emails (
  id bigint generated always as identity primary key,
  email text not null
);

create unique index member_emails_email_uidx
on public.member_emails (email);
