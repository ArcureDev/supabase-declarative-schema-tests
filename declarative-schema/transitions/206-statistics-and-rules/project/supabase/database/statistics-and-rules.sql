create schema analytics;

create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.stats_rule_source (
  id bigint primary key,
  region text not null,
  category text not null,
  sku text not null,
  payload text not null,
  touched_at timestamptz
);

create table public.stats_rule_audit (
  id bigint generated always as identity primary key,
  source_id bigint not null,
  note text not null
);

create statistics public.stats_rename_old (dependencies)
  on region, category from public.stats_rule_source;
create statistics public.stats_shape (ndistinct)
  on region, category from public.stats_rule_source;
create statistics public.stats_move (mcv)
  on region, category from public.stats_rule_source;
create statistics public.stats_retired (dependencies)
  on category, sku from public.stats_rule_source;
create statistics public.stats_owner (dependencies)
  on region, sku from public.stats_rule_source;

create function public.stats_rule_touch()
returns trigger language plpgsql as $$
begin
  new.touched_at := clock_timestamp();
  return new;
end
$$;

create trigger stats_rule_touch
before update on public.stats_rule_source
for each row execute function public.stats_rule_touch();

alter table public.stats_rule_source enable row level security;
create policy stats_rule_open on public.stats_rule_source
for all using (true) with check (true);

create rule stats_rules_rename_old
as on update to public.stats_rule_source
do also insert into public.stats_rule_audit(source_id, note)
values (new.id, 'rename:' || new.payload);

create rule stats_rules_replace
as on delete to public.stats_rule_source
do also insert into public.stats_rule_audit(source_id, note)
values (old.id, 'old:' || old.payload);

create rule stats_rules_disabled
as on update to public.stats_rule_source
do also insert into public.stats_rule_audit(source_id, note)
values (new.id, 'enabled:' || new.payload);

create rule stats_rules_retired
as on update to public.stats_rule_source
do also insert into public.stats_rule_audit(source_id, note)
values (new.id, 'retired:' || new.payload);
