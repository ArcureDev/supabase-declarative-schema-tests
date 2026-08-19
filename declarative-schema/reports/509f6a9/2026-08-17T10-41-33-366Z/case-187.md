# Case: 187-deterministic-output

## Baseline state A

```sql
create table public.deterministic_output_anchor (
  id bigint primary key,
  payload text not null
);
```

## Desired state B

```sql
create table public.deterministic_output_anchor (
  id bigint primary key,
  payload text not null
);

create table public.deterministic_output_parent (
  id bigint primary key,
  code text not null unique
);

create table public.deterministic_output_child (
  id bigint primary key,
  parent_id bigint not null
    references public.deterministic_output_parent (id)
    on delete cascade,
  payload text not null
);

create index deterministic_output_child_payload_idx
on public.deterministic_output_child (payload);
```

## Representative data setup

```sql
insert into public.deterministic_output_anchor (id, payload)
values (1, 'must remain unchanged');
```

## CLI-generated baseline migration files

### `20260817170213_deterministic_output_baseline.sql`

```sql
create table "public"."deterministic_output_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "deterministic_output_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."deterministic_output_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."deterministic_output_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."deterministic_output_anchor" to "service_role";
```


## Deterministic-output assertion

- Raw sync result: **OK**
- Assertion: **OK**
- Repeated generation produced 1 byte-identical migration file(s), ignoring timestamped filenames.

## Generated transition migration files

### `20260817170255_declarative_sync.sql`

```sql
create table "public"."deterministic_output_child" (
  "id"        bigint not null,
  "parent_id" bigint not null,
  "payload"   text   not null,
  constraint "deterministic_output_child_pkey" primary key (id)
);

create table "public"."deterministic_output_parent" (
  "id"   bigint not null,
  "code" text   not null,
  constraint "deterministic_output_parent_code_key" unique (code),
  constraint "deterministic_output_parent_pkey" primary key (id)
);

alter table "public"."deterministic_output_child"
  add constraint "deterministic_output_child_parent_id_fkey" foreign key (parent_id) references public.deterministic_output_parent(id) on delete cascade;

create index deterministic_output_child_payload_idx on public.deterministic_output_child using btree (payload);

grant maintain, references, trigger, truncate on table "public"."deterministic_output_child" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."deterministic_output_child" to "postgres";

grant maintain, references, trigger, truncate on table "public"."deterministic_output_child" to "service_role";

grant maintain, references, trigger, truncate on table "public"."deterministic_output_parent" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."deterministic_output_parent" to "postgres";

grant maintain, references, trigger, truncate on table "public"."deterministic_output_parent" to "service_role";
```


## Repeated generated transition migration files

### `20260817170336_declarative_sync.sql`

```sql
create table "public"."deterministic_output_child" (
  "id"        bigint not null,
  "parent_id" bigint not null,
  "payload"   text   not null,
  constraint "deterministic_output_child_pkey" primary key (id)
);

create table "public"."deterministic_output_parent" (
  "id"   bigint not null,
  "code" text   not null,
  constraint "deterministic_output_parent_code_key" unique (code),
  constraint "deterministic_output_parent_pkey" primary key (id)
);

alter table "public"."deterministic_output_child"
  add constraint "deterministic_output_child_parent_id_fkey" foreign key (parent_id) references public.deterministic_output_parent(id) on delete cascade;

create index deterministic_output_child_payload_idx on public.deterministic_output_child using btree (payload);

grant maintain, references, trigger, truncate on table "public"."deterministic_output_child" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."deterministic_output_child" to "postgres";

grant maintain, references, trigger, truncate on table "public"."deterministic_output_child" to "service_role";

grant maintain, references, trigger, truncate on table "public"."deterministic_output_parent" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."deterministic_output_parent" to "postgres";

grant maintain, references, trigger, truncate on table "public"."deterministic_output_parent" to "service_role";
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.0s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.6s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name deterministic_output_baseline --debug`
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
- Duration: `41.3s`
<!-- declarative-schema-command-result case="187-deterministic-output" engine="next" command="sync" status="OK" -->

## Repeat sync and deterministic comparison

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `41.1s`

## Verify unchanged state after repeated generation

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`
<!-- declarative-schema-command-result case="187-deterministic-output" engine="next" command="sync-verification" status="OK" -->

