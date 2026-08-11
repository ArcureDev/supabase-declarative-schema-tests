-- Invariant: only api_281 objects granted to API roles are externally visible.
create schema api_281;
grant usage on schema api_281 to anon, authenticated;

create table api_281.coverage_anchor_281 (
  case_no integer primary key,
  payload text not null,
  private_value text not null
);
revoke all on table api_281.coverage_anchor_281 from public, anon, authenticated;

create table api_281.exposure_items_281 (
  id bigint generated always as identity primary key,
  label text not null,
  published boolean not null default false
);
alter table api_281.exposure_items_281 enable row level security;
create policy exposure_items_read_281
  on api_281.exposure_items_281
  for select
  to anon, authenticated
  using (published);
grant select on table api_281.exposure_items_281 to anon, authenticated;

create view api_281.exposure_view_281
  with (security_invoker = true)
as
  select id, label, upper(label) as display_label_281
  from api_281.exposure_items_281;
grant select on table api_281.exposure_view_281 to anon, authenticated;

create function api_281.exposure_summary_281()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $function$
  select jsonb_build_object(
    'visible_count',
    count(*)
  )
  from api_281.exposure_items_281
$function$;
revoke all on function api_281.exposure_summary_281() from public;
grant execute on function api_281.exposure_summary_281()
  to anon, authenticated;
