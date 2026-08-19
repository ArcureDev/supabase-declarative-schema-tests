# Case: 215-trigger-definition-evolution

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_trigger_source (
  id bigint generated always as identity primary key,
  body text not null
);

create table public.transition_trigger_log (
  id bigint generated always as identity primary key,
  entry text not null
);

create function public.transition_capture_row()
returns trigger
language plpgsql
as $$
begin
  insert into public.transition_trigger_log (entry)
  values ('v1:' || new.body);
  return new;
end
$$;

create trigger transition_capture
after insert on public.transition_trigger_source
for each row
execute function public.transition_capture_row();
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_trigger_source (
  id bigint generated always as identity primary key,
  body text not null
);

create table public.transition_trigger_log (
  id bigint generated always as identity primary key,
  entry text not null
);

create function public.transition_capture_row()
returns trigger
language plpgsql
as $$
begin
  insert into public.transition_trigger_log (entry)
  values ('v2:' || new.body);
  return new;
end
$$;

create trigger transition_capture
after insert or update on public.transition_trigger_source
for each row
execute function public.transition_capture_row();
```

## Representative data setup

```sql
insert into public.transition_anchor (label) values ('215');
insert into public.transition_trigger_source (body) values ('alpha');
```

## CLI-generated baseline migration files

### `20260817192425_215_trigger_definition_evolution_baseline.sql`

```sql
set local check_function_bodies = off;

create table "public"."transition_anchor" (
  "id"    bigint generated always as identity not null,
  "label" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

create table "public"."transition_trigger_log" (
  "id"    bigint generated always as identity not null,
  "entry" text   not null,
  constraint "transition_trigger_log_pkey" primary key (id)
);

create table "public"."transition_trigger_source" (
  "id"   bigint generated always as identity not null,
  "body" text   not null,
  constraint "transition_trigger_source_pkey" primary key (id)
);

create or replace function public.transition_capture_row()
  returns trigger
  language plpgsql
  AS $function$
begin
  insert into public.transition_trigger_log (entry)
  values ('v1:' || new.body);
  return new;
end
$function$;

create trigger transition_capture
  after insert on public.transition_trigger_source
  for each row
  execute function public.transition_capture_row();

grant execute on function "public"."transition_capture_row"() to public, "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_trigger_log" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_trigger_log" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_trigger_log" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_trigger_source" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_trigger_source" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_trigger_source" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817192506_declarative_sync.sql`

```sql
set local check_function_bodies = off;

drop trigger "transition_capture" on "public"."transition_trigger_source";

create or replace function public.transition_capture_row()
  returns trigger
  language plpgsql
  AS $function$
begin
  insert into public.transition_trigger_log (entry)
  values ('v2:' || new.body);
  return new;
end
$function$;

create trigger transition_capture
  after insert or update on public.transition_trigger_source
  for each row
  execute function public.transition_capture_row();
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.4s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 215_trigger_definition_evolution_baseline --debug`
- Result: **OK**
- Duration: `40.3s`

## Insert representative data

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Baseline state capture

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `40.6s`
<!-- declarative-schema-command-result case="215-trigger-definition-evolution" engine="next" command="sync" status="OK" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **OK**
- Duration: `0.5s`

## Verify desired state B

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `41.1s`
<!-- declarative-schema-command-result case="215-trigger-definition-evolution" engine="next" command="sync-verification" status="OK" -->

