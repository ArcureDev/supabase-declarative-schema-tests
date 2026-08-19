# Case: 198-sequence-options

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create sequence public.transition_ticket_seq
  as bigint
  start with 10
  increment by 1
  minvalue 10
  maxvalue 100
  cache 1
  no cycle;

create table public.sequence_option_guard (
  id bigint primary key default nextval('public.transition_ticket_seq'),
  payload text not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create sequence public.transition_ticket_seq
  as bigint
  start with 10
  increment by 5
  minvalue 5
  maxvalue 1000
  cache 20
  cycle;

create table public.sequence_option_guard (
  id bigint primary key default nextval('public.transition_ticket_seq'),
  payload text not null
);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
insert into public.sequence_option_guard (payload) values ('existing');
```

## CLI-generated baseline migration files

### `20260817173525_198_sequence_options_baseline.sql`

```sql
create sequence "public"."transition_ticket_seq" as bigint increment by 1 minvalue 10 maxvalue 100 START with 10 cache 1 no cycle;

create table "public"."sequence_option_guard" (
  "id"      bigint not null default nextval('public.transition_ticket_seq'::regclass),
  "payload" text   not null,
  constraint "sequence_option_guard_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant update on sequence "public"."transition_ticket_seq" to "anon", "authenticated";

grant select, update, usage on sequence "public"."transition_ticket_seq" to "postgres";

grant update on sequence "public"."transition_ticket_seq" to "service_role";

grant maintain, references, trigger, truncate on table "public"."sequence_option_guard" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."sequence_option_guard" to "postgres";

grant maintain, references, trigger, truncate on table "public"."sequence_option_guard" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817173615_declarative_sync.sql`

```sql
alter sequence "public"."transition_ticket_seq" increment by 5 minvalue 5 maxvalue 1000 cache 20 cycle;
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.0s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.1s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 198_sequence_options_baseline --debug`
- Result: **OK**
- Duration: `59.3s`

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
- Duration: `49.6s`
<!-- declarative-schema-command-result case="198-sequence-options" engine="next" command="sync" status="OK" -->

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
- Duration: `40.0s`
<!-- declarative-schema-command-result case="198-sequence-options" engine="next" command="sync-verification" status="OK" -->

