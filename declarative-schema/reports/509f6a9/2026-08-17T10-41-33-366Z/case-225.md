# Case: 225-managed-schema-boundary

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.managed_probe_225 (
  id integer primary key,
  snapshot jsonb not null
);
create table public.boundary_app_225 (
  id bigint generated always as identity primary key,
  label text not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.managed_probe_225 (
  id integer primary key,
  snapshot jsonb not null
);
create table public.boundary_app_225 (
  id bigint generated always as identity primary key,
  label text not null,
  note text not null default ''
);
```

## Representative data setup

```sql
insert into public.transition_anchor (case_no, payload)
values (
  225,
  jsonb_build_object(
    'boundary_oid', 'public.boundary_app_225'::regclass::oid,
    'probe_oid', 'public.managed_probe_225'::regclass::oid
  )::text
);

insert into public.managed_probe_225 (id, snapshot)
values (
  1,
  jsonb_build_object(
    'auth.users', (
      select jsonb_build_object(
        'oid', relation.oid,
        'owner', relation.relowner,
        'acl', coalesce(to_jsonb(relation.relacl), 'null'::jsonb),
        'rls', relation.relrowsecurity
      )
      from pg_class as relation
      where relation.oid = 'auth.users'::regclass
    ),
    'storage.objects', (
      select jsonb_build_object(
        'oid', relation.oid,
        'owner', relation.relowner,
        'acl', coalesce(to_jsonb(relation.relacl), 'null'::jsonb),
        'rls', relation.relrowsecurity
      )
      from pg_class as relation
      where relation.oid = 'storage.objects'::regclass
    ),
    'realtime.messages', (
      select jsonb_build_object(
        'oid', relation.oid,
        'owner', relation.relowner,
        'acl', coalesce(to_jsonb(relation.relacl), 'null'::jsonb),
        'rls', relation.relrowsecurity
      )
      from pg_class as relation
      where relation.oid = 'realtime.messages'::regclass
    ),
    'publication.supabase_realtime',
      (select to_jsonb(publication) from pg_publication as publication
       where publication.pubname = 'supabase_realtime')
  )
);
insert into public.boundary_app_225 (label)
values ('managed boundary row');
```

## CLI-generated baseline migration files

### `20260817195016_225_managed_schema_boundary_baseline.sql`

```sql
create table "public"."boundary_app_225" (
  "id"    bigint generated always as identity not null,
  "label" text   not null,
  constraint "boundary_app_225_pkey" primary key (id)
);

create table "public"."managed_probe_225" (
  "id"       integer not null,
  "snapshot" jsonb   not null,
  constraint "managed_probe_225_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

grant maintain, references, trigger, truncate on table "public"."boundary_app_225" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."boundary_app_225" to "postgres";

grant maintain, references, trigger, truncate on table "public"."boundary_app_225" to "service_role";

grant maintain, references, trigger, truncate on table "public"."managed_probe_225" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."managed_probe_225" to "postgres";

grant maintain, references, trigger, truncate on table "public"."managed_probe_225" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817195056_declarative_sync.sql`

```sql
alter table "public"."boundary_app_225"
  add column "note" text not null default ''::text;
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.0s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.3s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 225_managed_schema_boundary_baseline --debug`
- Result: **OK**
- Duration: `40.1s`

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
- Duration: `39.7s`
<!-- declarative-schema-command-result case="225-managed-schema-boundary" engine="next" command="sync" status="OK" -->

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
- Duration: `50.1s`
<!-- declarative-schema-command-result case="225-managed-schema-boundary" engine="next" command="sync-verification" status="OK" -->

