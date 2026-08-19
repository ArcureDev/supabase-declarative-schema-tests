# Case: 201-constraint-property-evolution

## Baseline state A

```sql
create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.constraint_accounts (
  id bigint not null,
  tenant_id bigint not null,
  code text,
  amount numeric not null,
  constraint constraint_accounts_pkey primary key (id),
  constraint constraint_accounts_tenant_code_key
    unique (tenant_id, code) deferrable initially immediate,
  constraint constraint_accounts_amount_nonnegative check (amount >= 0)
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.constraint_accounts (
  id bigint not null,
  tenant_id bigint not null,
  code text,
  amount numeric not null,
  constraint constraint_accounts_pkey primary key (id),
  constraint constraint_accounts_tenant_code_key
    unique nulls not distinct (tenant_id, code)
    deferrable initially deferred,
  constraint constraint_accounts_amount_range
    check (amount between 0 and 10000)
);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
insert into public.constraint_accounts values
  (1, 10, 'A', 5),
  (2, 10, null, 9),
  (3, 11, null, 11);
```

## CLI-generated baseline migration files

### `20260817174408_201_constraint_property_evolution_baseline.sql`

```sql
create table "public"."constraint_accounts" (
  "id"        bigint  not null,
  "tenant_id" bigint  not null,
  "code"      text,
  "amount"    numeric not null,
  constraint "constraint_accounts_amount_nonnegative" check ((amount >= (0)::numeric)),
  constraint "constraint_accounts_pkey" primary key (id),
  constraint "constraint_accounts_tenant_code_key" unique (tenant_id, code) deferrable
);

create table "public"."transition_anchor" (
  "id"      integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."constraint_accounts" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."constraint_accounts" to "postgres";

grant maintain, references, trigger, truncate on table "public"."constraint_accounts" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817174508_declarative_sync.sql`

```sql
alter table "public"."constraint_accounts"
  drop constraint "constraint_accounts_amount_nonnegative";

alter table "public"."constraint_accounts"
  drop constraint "constraint_accounts_tenant_code_key";

alter table "public"."constraint_accounts"
  add constraint "constraint_accounts_amount_range" check (((amount >= (0)::numeric) AND (amount <= (10000)::numeric)));

alter table "public"."constraint_accounts"
  add constraint "constraint_accounts_tenant_code_key" unique nulls not DISTINCT (tenant_id, code) deferrable initially deferred;
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `20.8s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 201_constraint_property_evolution_baseline --debug`
- Result: **OK**
- Duration: `59.2s`

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
- Duration: `59.0s`
<!-- declarative-schema-command-result case="201-constraint-property-evolution" engine="next" command="sync" status="OK" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **OK**
- Duration: `0.6s`

## Verify desired state B

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `39.8s`
<!-- declarative-schema-command-result case="201-constraint-property-evolution" engine="next" command="sync-verification" status="OK" -->

