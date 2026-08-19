# Case: 181-rename-ambiguity

## Baseline state A

```sql
create table public.rename_ambiguity_source (
  id bigint primary key,
  payload text not null
);
```

## Desired state B

```sql
create table public.rename_ambiguity_target (
  id bigint primary key,
  payload text not null
);
```

## Representative data setup

```sql
insert into public.rename_ambiguity_source (id, payload)
values (1, 'must survive an ambiguous rename');
```

## CLI-generated baseline migration files

### `20260817164805_rename_ambiguity_baseline.sql`

```sql
create table "public"."rename_ambiguity_source" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "rename_ambiguity_source_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."rename_ambiguity_source" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."rename_ambiguity_source" to "postgres";

grant maintain, references, trigger, truncate on table "public"."rename_ambiguity_source" to "service_role";
```


## Rename-ambiguity safety assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The command completed with an explicit ambiguity/destructive-change diagnostic and did not infer a rename. Evidence: Found destructive changes in schema diff. Please double check if these are expected:

## Generated transition migration files

### `20260817164904_declarative_sync.sql`

```sql
drop table "public"."rename_ambiguity_source";

create table "public"."rename_ambiguity_target" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "rename_ambiguity_target_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."rename_ambiguity_target" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."rename_ambiguity_target" to "postgres";

grant maintain, references, trigger, truncate on table "public"."rename_ambiguity_target" to "service_role";
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.0s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name rename_ambiguity_baseline --debug`
- Result: **OK**
- Duration: `49.8s`

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
- Duration: `58.9s`
<!-- declarative-schema-command-result case="181-rename-ambiguity" engine="next" command="sync" status="OK" -->

## Verify unchanged state A after non-applied planning

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`
<!-- declarative-schema-command-result case="181-rename-ambiguity" engine="next" command="sync-verification" status="OK" -->

