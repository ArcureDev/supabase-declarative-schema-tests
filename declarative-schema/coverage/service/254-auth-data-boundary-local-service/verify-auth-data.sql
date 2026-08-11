do $$
declare
  email_user_id uuid;
  anonymous_count integer;
begin
  select id
  into email_user_id
  from auth.users
  where email = 'service-user-254@example.test'
    and not is_anonymous;

  select count(*)
  into anonymous_count
  from auth.users
  where is_anonymous;

  if email_user_id is null then
    raise exception 'email Auth service record 254 is missing';
  end if;
  if anonymous_count <> 1 then
    raise exception 'expected one anonymous Auth service record, found %',
      anonymous_count;
  end if;
  if not exists (
    select 1
    from auth.identities
    where user_id = email_user_id
      and provider = 'email'
  ) then
    raise exception 'email provider identity 254 is missing';
  end if;
  if not exists (
    select 1
    from auth.users
    where id = email_user_id
      and raw_app_meta_data ->> 'provider' = 'email'
      and raw_app_meta_data -> 'providers' ? 'email'
  ) then
    raise exception 'email provider metadata 254 is incomplete';
  end if;
  if (
    select to_jsonb(anchor_row)
    from public.service_boundary_anchor_254 as anchor_row
    where case_no = 254
  ) <> '{"case_no":254,"payload":"auth-data-is-service-state"}'::jsonb then
    raise exception 'Auth service behavior changed application anchor 254';
  end if;
end
$$;
