# Case: 208-partition-attach-and-inheritance

## Baseline state A

```sql
create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create sequence public.partition_attach_order_seq;

create table public.partition_attach_orders (
  id bigint not null default nextval('public.partition_attach_order_seq'),
  ordered_on date not null,
  customer_id bigint not null,
  payload text not null,
  constraint partition_attach_orders_pkey primary key (id, ordered_on)
) partition by range (ordered_on);

create index partition_attach_orders_customer_idx
  on public.partition_attach_orders (customer_id);

create function public.partition_attach_uppercase()
returns trigger language plpgsql as $$
begin
  new.payload := upper(new.payload);
  return new;
end
$$;

create trigger partition_attach_uppercase
before insert or update on public.partition_attach_orders
for each row execute function public.partition_attach_uppercase();

alter table public.partition_attach_orders enable row level security;
create policy partition_attach_open on public.partition_attach_orders
for all using (true) with check (true);

create table public.partition_attach_existing (
  id bigint not null default nextval('public.partition_attach_order_seq'),
  ordered_on date not null,
  customer_id bigint not null,
  payload text not null,
  constraint partition_attach_existing_pkey primary key (id, ordered_on),
  constraint partition_attach_existing_bound
    check (ordered_on >= date '2026-01-01'
       and ordered_on < date '2027-01-01')
);

create index partition_attach_existing_customer_idx
  on public.partition_attach_existing (customer_id);

create table public.partition_attach_refs (
  id bigint generated always as identity primary key,
  order_id bigint not null,
  ordered_on date not null,
  constraint partition_attach_refs_order_fk
    foreign key (order_id, ordered_on)
    references public.partition_attach_orders (id, ordered_on)
);

create publication partition_attach_publication
for table public.partition_attach_orders
with (publish_via_partition_root = true);

create table public.inherit_base_a (
  id bigint not null,
  payload text not null,
  constraint inherit_base_payload_check check (length(payload) > 0)
);
create table public.inherit_base_b (tag text not null);
create table public.inherit_multi_child (
  tag text not null,
  extra text
) inherits (public.inherit_base_a);
create table public.inherit_drop_child (
  extra text
) inherits (public.inherit_base_a, public.inherit_base_b);
```

## Desired state B

```sql
create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create sequence public.partition_attach_order_seq;

create table public.partition_attach_orders (
  id bigint not null default nextval('public.partition_attach_order_seq'),
  ordered_on date not null,
  customer_id bigint not null,
  payload text not null,
  constraint partition_attach_orders_pkey primary key (id, ordered_on)
) partition by range (ordered_on);

create index partition_attach_orders_customer_idx
  on public.partition_attach_orders (customer_id);

create function public.partition_attach_uppercase()
returns trigger language plpgsql as $$
begin
  new.payload := upper(new.payload);
  return new;
end
$$;

create trigger partition_attach_uppercase
before insert or update on public.partition_attach_orders
for each row execute function public.partition_attach_uppercase();

alter table public.partition_attach_orders enable row level security;
create policy partition_attach_open on public.partition_attach_orders
for all using (true) with check (true);

create table public.partition_attach_existing (
  id bigint not null default nextval('public.partition_attach_order_seq'),
  ordered_on date not null,
  customer_id bigint not null,
  payload text not null,
  constraint partition_attach_existing_pkey primary key (id, ordered_on),
  constraint partition_attach_existing_bound
    check (ordered_on >= date '2026-01-01'
       and ordered_on < date '2027-01-01')
);

create index partition_attach_existing_customer_idx
  on public.partition_attach_existing (customer_id);

alter table public.partition_attach_orders
  attach partition public.partition_attach_existing
  for values from ('2026-01-01') to ('2027-01-01');

create table public.partition_attach_refs (
  id bigint generated always as identity primary key,
  order_id bigint not null,
  ordered_on date not null,
  constraint partition_attach_refs_order_fk
    foreign key (order_id, ordered_on)
    references public.partition_attach_orders (id, ordered_on)
);

create publication partition_attach_publication
for table public.partition_attach_orders
with (publish_via_partition_root = true);

create table public.inherit_base_a (
  id bigint not null,
  payload text not null,
  constraint inherit_base_payload_check
    check (length(payload) > 0) no inherit
);
create table public.inherit_base_b (tag text not null);
create table public.inherit_multi_child (
  extra text
) inherits (public.inherit_base_a, public.inherit_base_b);
create table public.inherit_drop_child (
  tag text not null,
  extra text
) inherits (public.inherit_base_a);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
insert into public.partition_attach_existing
  (ordered_on, customer_id, payload)
values ('2026-04-01', 7, 'keep');
insert into public.inherit_multi_child
values (10, 'multi', 'tag-a', 'extra-a');
insert into public.inherit_drop_child
values (20, 'drop', 'tag-b', 'extra-b');
```

## CLI-generated baseline migration files

### `20260817180559_208_partition_attach_and_inheritance_baseline.sql`

```sql
set local check_function_bodies = off;

create sequence "public"."partition_attach_order_seq" as bigint increment by 1 minvalue 1 maxvalue 9223372036854775807 START with 1 cache 1 no cycle;

create table "public"."inherit_base_a" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "inherit_base_payload_check" check ((length(payload) > 0))
);

create table "public"."inherit_base_b" (
  "tag" text not null
);

create table "public"."inherit_drop_child" () inherits ("public"."inherit_base_a");

create table "public"."inherit_multi_child" () inherits ("public"."inherit_base_a");

create table "public"."partition_attach_existing" (
  "id"          bigint not null default nextval('public.partition_attach_order_seq'::regclass),
  "ordered_on"  date   not null,
  "customer_id" bigint not null,
  "payload"     text   not null,
  constraint "partition_attach_existing_bound" check (((ordered_on >= '2026-01-01'::date) AND (ordered_on < '2027-01-01'::date))),
  constraint "partition_attach_existing_pkey" primary key (id, ordered_on)
);

create table "public"."partition_attach_orders" (
  "id"          bigint not null,
  "ordered_on"  date   not null,
  "customer_id" bigint not null,
  "payload"     text   not null
) partition by range (ordered_on);

alter table "public"."partition_attach_orders"
  enable row level security;

create table "public"."partition_attach_refs" (
  "id"         bigint generated always as identity not null,
  "order_id"   bigint not null,
  "ordered_on" date   not null,
  constraint "partition_attach_refs_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (id)
);

alter table "public"."inherit_drop_child"
  add column "extra" text;

alter table "public"."inherit_multi_child"
  add column "tag" text not null;

alter table "public"."inherit_multi_child"
  add column "extra" text;

alter table "public"."partition_attach_orders"
  alter column "id" set default nextval('public.partition_attach_order_seq'::regclass);

create or replace function public.partition_attach_uppercase()
  returns trigger
  language plpgsql
  AS $function$
begin
  new.payload := upper(new.payload);
  return new;
end
$function$;

alter table "public"."partition_attach_orders"
  add constraint "partition_attach_orders_pkey" primary key (id, ordered_on);

alter table "public"."partition_attach_refs"
  add constraint "partition_attach_refs_order_fk" foreign key (order_id, ordered_on) references public.partition_attach_orders(id, ordered_on);

create index partition_attach_existing_customer_idx on public.partition_attach_existing using btree (customer_id);

create index partition_attach_orders_customer_idx on only public.partition_attach_orders using btree (customer_id);

create trigger partition_attach_uppercase
  before insert or update on public.partition_attach_orders
  for each row
  execute function public.partition_attach_uppercase();

create policy "partition_attach_open" on "public"."partition_attach_orders"
  for all
  to PUBLIC
  using (true)
  with check (true);

create publication "partition_attach_publication" for table "public"."partition_attach_orders" with (
  publish                    = 'insert, update, delete, truncate',
  publish_via_partition_root = true
);

grant execute on function "public"."partition_attach_uppercase"() to public, "postgres";

grant update on sequence "public"."partition_attach_order_seq" to "anon", "authenticated";

grant select, update, usage on sequence "public"."partition_attach_order_seq" to "postgres";

grant update on sequence "public"."partition_attach_order_seq" to "service_role";

grant maintain, references, trigger, truncate on table "public"."inherit_base_a" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."inherit_base_a" to "postgres";

grant maintain, references, trigger, truncate on table "public"."inherit_base_a" to "service_role";

grant maintain, references, trigger, truncate on table "public"."inherit_base_b" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."inherit_base_b" to "postgres";

grant maintain, references, trigger, truncate on table "public"."inherit_base_b" to "service_role";

grant maintain, references, trigger, truncate on table "public"."inherit_drop_child" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."inherit_drop_child" to "postgres";

grant maintain, references, trigger, truncate on table "public"."inherit_drop_child" to "service_role";

grant maintain, references, trigger, truncate on table "public"."inherit_multi_child" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."inherit_multi_child" to "postgres";

grant maintain, references, trigger, truncate on table "public"."inherit_multi_child" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_attach_existing" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_attach_existing" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_attach_existing" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_attach_orders" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_attach_orders" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_attach_orders" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_attach_refs" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_attach_refs" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_attach_refs" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **SKIPPED**
- Assertion: **SKIPPED**
- The safety assertion could not run because baseline setup or verification failed.

## Generated transition migration files

_(no files generated)_

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `20.9s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 208_partition_attach_and_inheritance_baseline --debug`
- Result: **OK**
- Duration: `49.7s`

## Insert representative data

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **ERROR**
- Duration: `0.1s`
- Exit code: `3`

```text
INSERT 0 1
INSERT 0 1
INSERT 0 1
psql:<stdin>:8: ERROR:  INSERT has more expressions than target columns
LINE 2: values (20, 'drop', 'tag-b', 'extra-b');
                                     ^
```


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The declarative baseline failed, so the safe populated partition attachment with reusable indexes, constraints, sequence, trigger, RLS, publication and foreign key plus multiple inheritance and NO INHERIT evolution transition was skipped.
```
<!-- declarative-schema-command-result case="208-partition-attach-and-inheritance" engine="next" command="sync" status="ERROR" -->

### Transition fallback (legacy)

- Overall result: **FAILED**
- Raw sync result: **SKIPPED**
- Assertion: **SKIPPED**
- The safety assertion could not run because the declarative baseline failed.

### Legacy-generated baseline migration files

_(no files generated)_

### Legacy-generated transition migration files

_(no files generated)_

### Start local runtime (legacy)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `22.6s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name 208_partition_attach_and_inheritance_baseline --debug`
- Result: **ERROR**
- Duration: `44.1s`
- Exit code: `1`

```text
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta legacy implementation.
Creating shadow database...
Initialising schema...
+ ulimit -n
+ '[' -n '' ']'
+ export ERL_CRASH_DUMP=/tmp/erl_crash.dump
+ ERL_CRASH_DUMP=/tmp/erl_crash.dump
+ '[' false = true ']'
+ [[ -n '' ]]
+ echo 'Running migrations'
+ sudo -E -u nobody /app/bin/migrate
+ '[' true = true ']'
+ echo 'Seeding selfhosted Realtime'
+ sudo -E -u nobody /app/bin/realtime eval 'Realtime.Release.seeds(Realtime.Repo)'
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
+ echo 'Starting Realtime'
+ ulimit -n
+ exec /app/bin/realtime eval '{:ok, _} = Application.ensure_all_started(:realtime)
{:ok, _} = Realtime.Tenants.health_check("realtime-dev")'
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
Seeding globals from roles.sql...
Creating shadow database...
Initialising schema...
+ ulimit -n
+ '[' -n '' ']'
+ export ERL_CRASH_DUMP=/tmp/erl_crash.dump
+ ERL_CRASH_DUMP=/tmp/erl_crash.dump
+ '[' false = true ']'
+ [[ -n '' ]]
+ echo 'Running migrations'
+ sudo -E -u nobody /app/bin/migrate
+ '[' true = true ']'
+ echo 'Seeding selfhosted Realtime'
+ sudo -E -u nobody /app/bin/realtime eval 'Realtime.Release.seeds(Realtime.Repo)'
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
+ echo 'Starting Realtime'
+ ulimit -n
+ exec /app/bin/realtime eval '{:ok, _} = Application.ensure_all_started(:realtime)
{:ok, _} = Realtime.Tenants.health_check("realtime-dev")'
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
Seeding globals from roles.sql...
Applying declarative schemas via pg-delta...
Applied 18 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

DROP EXTENSION pg_net;

CREATE SEQUENCE public.partition_attach_order_seq;

GRANT UPDATE ON SEQUENCE public.partition_attach_order_seq TO anon;

GRANT UPDATE ON SEQUENCE public.partition_attach_order_seq TO authenticated;

GRANT UPDATE ON SEQUENCE public.partition_attach_order_seq TO service_role;

CREATE FUNCTION public.partition_attach_uppercase()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
begin
  new.payload := upper(new.payload);
  return new;
end
$function$;

CREATE TABLE public.inherit_base_a (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.inherit_base_a
  ADD CONSTRAINT inherit_base_payload_check CHECK (length(payload) > 0);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_base_a TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_base_a TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_base_a TO service_role;

CREATE TABLE public.inherit_base_b (
  tag text NOT NULL
);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_base_b TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_base_b TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_base_b TO service_role;

CREATE TABLE public.inherit_drop_child (
  id      bigint NOT NULL,
  payload text   NOT NULL,
  tag     text   NOT NULL,
  extra   text
) INHERITS (public.inherit_base_b);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_drop_child TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_drop_child TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_drop_child TO service_role;

CREATE TABLE public.inherit_multi_child (
  id      bigint NOT NULL,
  payload text   NOT NULL,
  tag     text   NOT NULL,
  extra   text
) INHERITS (public.inherit_base_a);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_multi_child TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_multi_child TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.inherit_multi_child TO service_role;

CREATE TABLE public.partition_attach_existing (
  id          bigint DEFAULT nextval('public.partition_attach_order_seq'::regclass) NOT NULL,
  ordered_on  date   NOT NULL,
  customer_id bigint NOT NULL,
  payload     text   NOT NULL
);

ALTER TABLE public.partition_attach_existing
  ADD CONSTRAINT partition_attach_existing_bound CHECK (ordered_on >= '2026-01-01'::date AND ordered_on < '2027-01-01'::date);

ALTER TABLE public.partition_attach_existing
  ADD CONSTRAINT partition_attach_existing_pkey PRIMARY KEY (id, ordered_on);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_attach_existing TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_attach_existing TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_attach_existing TO service_role;

CREATE INDEX partition_attach_existing_customer_idx ON public.partition_attach_existing (customer_id);

CREATE TABLE public.partition_attach_orders (
  id          bigint DEFAULT nextval('public.partition_attach_order_seq'::regclass) NOT NULL,
  ordered_on  date   NOT NULL,
  customer_id bigint NOT NULL,
  payload     text   NOT NULL
) PARTITION BY RANGE (ordered_on);

CREATE PUBLICATION partition_attach_publication FOR TABLE public.partition_attach_orders WITH (
  publish_via_partition_root = true
);

ALTER TABLE public.partition_attach_orders
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.partition_attach_orders
  ADD CONSTRAINT partition_attach_orders_pkey PRIMARY KEY (id, ordered_on);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_attach_orders TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_attach_orders TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_attach_orders TO service_role;

CREATE INDEX partition_attach_orders_customer_idx ON public.partition_attach_orders (customer_id);

CREATE TRIGGER partition_attach_uppercase
  BEFORE INSERT OR UPDATE ON public.partition_attach_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.partition_attach_uppercase();

CREATE POLICY partition_attach_open ON public.partition_attach_orders
  USING (true)
  WITH CHECK (true);

CREATE TABLE public.partition_attach_refs (
  id         bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  order_id   bigint NOT NULL,
  ordered_on date   NOT NULL
);

ALTER TABLE public.partition_attach_refs
  ADD CONSTRAINT partition_attach_refs_order_fk FOREIGN KEY (order_id, ordered_on) REFERENCES public.partition_attach_orders(id, ordered_on);

ALTER TABLE public.partition_attach_refs
  ADD CONSTRAINT partition_attach_refs_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_attach_refs TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_attach_refs TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_attach_refs TO service_role;

CREATE TABLE public.transition_anchor (
  id      integer NOT NULL,
  payload text    NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\208-partition-attach-and-inheritance-legacy\supabase\migrations\20260817180707_208_partition_attach_and_inheritance_baseline.sql
Found drop statements in schema diff. Please double check if these are expected:
DROP EXTENSION pg_net
Migration failed to apply: ERROR: extension "pg_net" does not exist (SQLSTATE 42704)
At statement: 1
DROP EXTENSION pg_net

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\208-partition-attach-and-inheritance-legacy\supabase\.temp\pgdelta\debug\20260817-180707-apply-error

To report this issue, you can:
  1. Open an issue at https://github.com/supabase/pg-toolbelt/issues
     Attach the files from the debug folder above.
  2. Open a support ticket at https://supabase.com/dashboard/support
     (only visible to Supabase employees)

WARNING: The debug folder may contain sensitive information about your
database schema, including table structures, function definitions, and role
configurations. Review the contents carefully before sharing publicly.
If unsure, prefer opening a support ticket (option 2) instead.
ERROR: extension "pg_net" does not exist (SQLSTATE 42704)
At statement: 1
DROP EXTENSION pg_net
```

### Sync (legacy)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The declarative baseline failed, so the safe populated partition attachment with reusable indexes, constraints, sequence, trigger, RLS, publication and foreign key plus multiple inheritance and NO INHERIT evolution transition was skipped.
```
<!-- declarative-schema-command-result case="208-partition-attach-and-inheritance" engine="legacy" command="sync" status="ERROR" -->

