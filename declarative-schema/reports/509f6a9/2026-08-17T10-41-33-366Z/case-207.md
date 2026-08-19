# Case: 207-partition-lifecycle

## Baseline state A

```sql
create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.partition_events (
  id bigint not null,
  happened_on date not null,
  region text not null,
  payload text not null
) partition by range (happened_on);

create table public.partition_events_obsolete
partition of public.partition_events
for values from ('2022-01-01') to ('2023-01-01');

create table public.partition_events_retire
partition of public.partition_events
for values from ('2023-01-01') to ('2024-01-01');

create table public.partition_events_2024
partition of public.partition_events
for values from ('2024-01-01') to ('2024-06-01');

create table public.partition_events_2025
partition of public.partition_events
for values from ('2025-01-01') to ('2026-01-01')
partition by list (region);

create table public.partition_events_2025_eu
partition of public.partition_events_2025 for values in ('eu');
create table public.partition_events_2025_default
partition of public.partition_events_2025 default;
create table public.partition_events_default
partition of public.partition_events default;

create table public.partition_metrics (
  id bigint not null,
  bucket integer not null
) partition by hash (bucket);
create table public.partition_metrics_p0
partition of public.partition_metrics
for values with (modulus 2, remainder 0);
```

## Desired state B

```sql
create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.partition_events (
  id bigint not null,
  happened_on date not null,
  region text not null,
  payload text not null
) partition by range (happened_on);

create table public.partition_events_retire (
  id bigint not null,
  happened_on date not null,
  region text not null,
  payload text not null
);

create table public.partition_events_2024
partition of public.partition_events
for values from ('2024-01-01') to ('2024-07-01');

create table public.partition_events_2025
partition of public.partition_events
for values from ('2025-01-01') to ('2026-01-01')
partition by list (region);

create table public.partition_events_2025_eu
partition of public.partition_events_2025 for values in ('eu');
create table public.partition_events_2025_default
partition of public.partition_events_2025 default;
create table public.partition_events_2026
partition of public.partition_events
for values from ('2026-01-01') to ('2027-01-01');
create table public.partition_events_default
partition of public.partition_events default;

create table public.partition_metrics (
  id bigint not null,
  bucket integer not null
) partition by hash (bucket);
create table public.partition_metrics_p0
partition of public.partition_metrics
for values with (modulus 2, remainder 0);
create table public.partition_metrics_p1
partition of public.partition_metrics
for values with (modulus 2, remainder 1);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
insert into public.partition_events values
  (1, '2024-05-01', 'eu', 'old-bound'),
  (2, '2025-02-01', 'eu', 'list-eu'),
  (3, '2025-03-01', 'us', 'list-default'),
  (4, '2023-05-01', 'eu', 'detach-me'),
  (5, '2027-05-01', 'eu', 'range-default');
```

## CLI-generated baseline migration files

### `20260817180239_207_partition_lifecycle_baseline.sql`

```sql
create table "public"."partition_events" (
  "id"          bigint not null,
  "happened_on" date   not null,
  "region"      text   not null,
  "payload"     text   not null
) partition by range (happened_on);

create table "public"."partition_events_2024" partition of "public"."partition_events" for values from ('2024-01-01') to ('2024-06-01');

create table "public"."partition_events_2025" partition of "public"."partition_events" for values from ('2025-01-01') to ('2026-01-01') partition by LIST (region);

create table "public"."partition_events_2025_default" partition of "public"."partition_events_2025" default;

create table "public"."partition_events_2025_eu" partition of "public"."partition_events_2025" for values in ('eu');

create table "public"."partition_events_default" partition of "public"."partition_events" default;

create table "public"."partition_events_obsolete" partition of "public"."partition_events" for values from ('2022-01-01') to ('2023-01-01');

create table "public"."partition_events_retire" partition of "public"."partition_events" for values from ('2023-01-01') to ('2024-01-01');

create table "public"."partition_metrics" (
  "id"     bigint  not null,
  "bucket" integer not null
) partition by HASH (bucket);

create table "public"."partition_metrics_p0" partition of "public"."partition_metrics" for values with (modulus 2, remainder 0);

create table "public"."transition_anchor" (
  "id"      integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."partition_events" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_2024" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_2024" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_2024" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_2025" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_2025" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_2025" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_2025_default" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_2025_default" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_2025_default" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_2025_eu" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_2025_eu" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_2025_eu" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_default" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_default" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_default" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_obsolete" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_obsolete" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_obsolete" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_retire" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_retire" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_retire" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_metrics" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_metrics" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_metrics" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_metrics_p0" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_metrics_p0" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_metrics_p0" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **ERROR**
- The generated migration did not satisfy its declared SQL-shape contract. Missing operation(s): detaches the populated partition before changing its bound, reattaches the expanded partition bound, detaches the retired populated partition. Forbidden operation(s): does not truncate populated data, does not drop the populated bound-change partition, does not drop the detached populated table.

## Generated transition migration files

### `20260817180320_declarative_sync.sql`

```sql
drop table "public"."partition_events_2024";

drop table "public"."partition_events_obsolete";

drop table "public"."partition_events_retire";

create table "public"."partition_events_2024" partition of "public"."partition_events" for values from ('2024-01-01') to ('2024-07-01');

create table "public"."partition_events_2026" partition of "public"."partition_events" for values from ('2026-01-01') to ('2027-01-01');

create table "public"."partition_events_retire" (
  "id"          bigint not null,
  "happened_on" date   not null,
  "region"      text   not null,
  "payload"     text   not null
);

create table "public"."partition_metrics_p1" partition of "public"."partition_metrics" for values with (modulus 2, remainder 1);

grant maintain, references, trigger, truncate on table "public"."partition_events_2024" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_2024" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_2024" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_2026" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_2026" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_2026" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_retire" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_retire" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_retire" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_metrics_p1" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_metrics_p1" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_metrics_p1" to "service_role";
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

- Command: `npx supabase db schema declarative sync --apply --name 207_partition_lifecycle_baseline --debug`
- Result: **OK**
- Duration: `59.8s`

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
- Result: **ERROR**
- Duration: `40.3s`
- Exit code: `0`

```text
The generated migration did not satisfy its declared SQL-shape contract. Missing operation(s): detaches the populated partition before changing its bound, reattaches the expanded partition bound, detaches the retired populated partition. Forbidden operation(s): does not truncate populated data, does not drop the populated bound-change partition, does not drop the detached populated table.
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta next implementation.
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
Applying migration 20260817180239_207_partition_lifecycle_baseline.sql...
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
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
[os_mon] memory supervisor port (memsup): Erlang has closed
+ echo 'Starting Realtime'
+ ulimit -n
+ exec /app/bin/realtime eval '{:ok, _} = Application.ensure_all_started(:realtime)
{:ok, _} = Realtime.Tenants.health_check("realtime-dev")'
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
Seeding globals from roles.sql...
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.email_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.inserted_at message=edge default:realtime.messages_2026_08_16.inserted_at -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.updated_at message=edge default:vault.secrets.updated_at -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.updated_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.inserted_at message=edge default:realtime.messages_2026_08_17.inserted_at -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.key_id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.key_id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.inserted_at message=edge default:realtime.messages_2026_08_19.inserted_at -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_19.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_19.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.created_at message=edge default:vault.secrets.created_at -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.created_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.id message=edge default:realtime.messages_2026_08_17.id -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> column:realtime.subscription.claims references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.phone_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:vault.secrets_name_idx message=edge index:vault.secrets_name_idx -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.name message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.inserted_at message=edge default:realtime.messages_2026_08_18.inserted_at -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.private message=edge default:realtime.messages_2026_08_19.private -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.nonce message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.id message=edge default:vault.secrets.id -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:vault.secrets.secrets_pkey message=edge constraint:vault.secrets.secrets_pkey -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.id message=edge default:realtime.messages_2026_08_16.id -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.private message=edge default:realtime.messages_2026_08_16.private -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.identities.email message=edge default:auth.identities.email -[depends]-> column:auth.identities.identity_data references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_20.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_20.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.id message=edge default:realtime.messages_2026_08_18.id -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.updated_at message=edge default:realtime.messages_2026_08_18.updated_at -[depends]-> column:realtime.messages_2026_08_18.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_20.private message=edge default:realtime.messages_2026_08_20.private -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.updated_at message=edge default:realtime.messages_2026_08_19.updated_at -[depends]-> column:realtime.messages_2026_08_19.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.id message=edge default:realtime.messages_2026_08_19.id -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.nonce message=edge column:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.private message=edge default:realtime.messages_2026_08_17.private -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_20.id message=edge default:realtime.messages_2026_08_20.id -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.secret message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.secret references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.updated_at message=edge default:realtime.messages_2026_08_17.updated_at -[depends]-> column:realtime.messages_2026_08_17.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:storage.objects.path_tokens message=edge default:storage.objects.path_tokens -[depends]-> column:storage.objects.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.updated_at message=edge default:realtime.messages_2026_08_16.updated_at -[depends]-> column:realtime.messages_2026_08_16.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.private message=edge default:realtime.messages_2026_08_18.private -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_20.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_20.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> function:realtime.to_regrole(text) references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_19.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_19.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.description message=edge default:vault.secrets.description -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.description message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=sequence:realtime.subscription_id_seq message=edge sequence:realtime.subscription_id_seq -[depends]-> schema:realtime references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_20.updated_at message=edge default:realtime.messages_2026_08_20.updated_at -[depends]-> column:realtime.messages_2026_08_20.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_20.inserted_at message=edge default:realtime.messages_2026_08_20.inserted_at -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=pgbouncer.get_auth: permission denied for schema pgbouncer
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=auth.uid: permission denied for schema auth
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=auth.role: permission denied for schema auth
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=auth.email: permission denied for schema auth
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.apply_rls: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.broadcast_changes: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.cast: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.pgrst_drop_watch: must be owner of function pgrst_drop_watch
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.quote_wal2json: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.wal2json_escape_identifier: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.pgrst_ddl_watch: must be owner of function pgrst_ddl_watch
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.grant_pg_cron_access: must be owner of function grant_pg_cron_access
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.set_graphql_placeholder: must be owner of function set_graphql_placeholder
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.grant_pg_graphql_access: must be owner of function grant_pg_graphql_access
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=graphql_public.graphql: permission denied for schema graphql_public
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.grant_pg_net_access: must be owner of function grant_pg_net_access
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.build_prepared_statement_sql: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.check_equality_op: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.check_equality_op: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.is_visible_through_filters: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.list_changes: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.foldername: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.get_size_by_bucket: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.extension: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.filename: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.send: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.send_binary: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.subscription_check_filters: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.to_regrole: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.topic: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.update_updated_at_column: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.can_insert_object: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.list_multipart_uploads_with_delimiter: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.operation: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.enforce_bucket_name_length: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.get_common_prefix: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.list_objects_with_delimiter: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.search_v2: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.search_by_timestamp: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.protect_delete: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.search: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.allow_only_operation: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.allow_any_operation: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=auth.jwt: permission denied for schema auth
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.email_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.inserted_at message=edge default:realtime.messages_2026_08_16.inserted_at -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.updated_at message=edge default:vault.secrets.updated_at -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.updated_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.inserted_at message=edge default:realtime.messages_2026_08_17.inserted_at -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.key_id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.key_id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_19.inserted_at message=edge default:realtime.messages_2026_08_19.inserted_at -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_19.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_19.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.created_at message=edge default:vault.secrets.created_at -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.created_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.id message=edge default:realtime.messages_2026_08_17.id -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> column:realtime.subscription.claims references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.phone_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:vault.secrets_name_idx message=edge index:vault.secrets_name_idx -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.name message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.inserted_at message=edge default:realtime.messages_2026_08_18.inserted_at -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_19.private message=edge default:realtime.messages_2026_08_19.private -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.nonce message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.id message=edge default:vault.secrets.id -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:vault.secrets.secrets_pkey message=edge constraint:vault.secrets.secrets_pkey -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.id message=edge default:realtime.messages_2026_08_16.id -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.private message=edge default:realtime.messages_2026_08_16.private -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:auth.identities.email message=edge default:auth.identities.email -[depends]-> column:auth.identities.identity_data references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_20.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_20.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.id message=edge default:realtime.messages_2026_08_18.id -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.updated_at message=edge default:realtime.messages_2026_08_18.updated_at -[depends]-> column:realtime.messages_2026_08_18.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_20.private message=edge default:realtime.messages_2026_08_20.private -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_19.updated_at message=edge default:realtime.messages_2026_08_19.updated_at -[depends]-> column:realtime.messages_2026_08_19.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_19.id message=edge default:realtime.messages_2026_08_19.id -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.nonce message=edge column:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.private message=edge default:realtime.messages_2026_08_17.private -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_20.id message=edge default:realtime.messages_2026_08_20.id -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.secret message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.secret references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.updated_at message=edge default:realtime.messages_2026_08_17.updated_at -[depends]-> column:realtime.messages_2026_08_17.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:storage.objects.path_tokens message=edge default:storage.objects.path_tokens -[depends]-> column:storage.objects.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.updated_at message=edge default:realtime.messages_2026_08_16.updated_at -[depends]-> column:realtime.messages_2026_08_16.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.private message=edge default:realtime.messages_2026_08_18.private -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_20.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_20.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> function:realtime.to_regrole(text) references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_19.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_19.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.description message=edge default:vault.secrets.description -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.description message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=sequence:realtime.subscription_id_seq message=edge sequence:realtime.subscription_id_seq -[depends]-> schema:realtime references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_20.updated_at message=edge default:realtime.messages_2026_08_20.updated_at -[depends]-> column:realtime.messages_2026_08_20.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_20.inserted_at message=edge default:realtime.messages_2026_08_20.inserted_at -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
Generated migration SQL:
drop table "public"."partition_events_2024";

drop table "public"."partition_events_obsolete";

drop table "public"."partition_events_retire";

create table "public"."partition_events_2024" partition of "public"."partition_events" for values from ('2024-01-01') to ('2024-07-01');

create table "public"."partition_events_2026" partition of "public"."partition_events" for values from ('2026-01-01') to ('2027-01-01');

create table "public"."partition_events_retire" (
  "id"          bigint not null,
  "happened_on" date   not null,
  "region"      text   not null,
  "payload"     text   not null
);

create table "public"."partition_metrics_p1" partition of "public"."partition_metrics" for values with (modulus 2, remainder 1);

grant maintain, references, trigger, truncate on table "public"."partition_events_2024" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_2024" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_2024" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_2026" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_2026" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_2026" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_retire" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_retire" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_retire" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_metrics_p1" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_metrics_p1" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_metrics_p1" to "service_role";

Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\207-partition-lifecycle\supabase\migrations\20260817180320_declarative_sync.sql
Found destructive changes in schema diff. Please double check if these are expected:
DROP TABLE "public"."partition_events_2024"
DROP TABLE "public"."partition_events_obsolete"
DROP TABLE "public"."partition_events_retire"
A new version of Supabase CLI is available: v2.114.0 (currently installed v0.0.0-pr.6102)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
Generated migration SQL:
drop table "public"."partition_events_2024";

drop table "public"."partition_events_obsolete";

drop table "public"."partition_events_retire";

create table "public"."partition_events_2024" partition of "public"."partition_events" for values from ('2024-01-01') to ('2024-07-01');

create table "public"."partition_events_2026" partition of "public"."partition_events" for values from ('2026-01-01') to ('2027-01-01');

create table "public"."partition_events_retire" (
  "id"          bigint not null,
  "happened_on" date   not null,
  "region"      text   not null,
  "payload"     text   not null
);

create table "public"."partition_metrics_p1" partition of "public"."partition_metrics" for values with (modulus 2, remainder 1);

grant maintain, references, trigger, truncate on table "public"."partition_events_2024" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_2024" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_2024" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_2026" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_2026" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_2026" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_events_retire" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_events_retire" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_events_retire" to "service_role";

grant maintain, references, trigger, truncate on table "public"."partition_metrics_p1" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."partition_metrics_p1" to "postgres";

grant maintain, references, trigger, truncate on table "public"."partition_metrics_p1" to "service_role";
```
<!-- declarative-schema-command-result case="207-partition-lifecycle" engine="next" command="sync" status="ERROR" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The generated migration failed its safety assertion, so it was not applied.
```

## Verify desired state B

- Command: `docker exec ... psql --file -`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The transition migration was not applied, so desired state B was not verified.
```

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Desired state B verification failed, so convergence was not checked.
```
<!-- declarative-schema-command-result case="207-partition-lifecycle" engine="next" command="sync-verification" status="ERROR" -->

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
- Duration: `22.3s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name 207_partition_lifecycle_baseline --debug`
- Result: **ERROR**
- Duration: `62.8s`
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
Applied 13 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.partition_events (
  id          bigint NOT NULL,
  happened_on date   NOT NULL,
  region      text   NOT NULL,
  payload     text   NOT NULL
) PARTITION BY RANGE (happened_on);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events TO service_role;

CREATE TABLE public.partition_events_2024 PARTITION OF public.partition_events FOR VALUES FROM ('2024-01-01') TO ('2024-06-01');

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2024 TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2024 TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2024 TO service_role;

CREATE TABLE public.partition_events_2025 PARTITION OF public.partition_events FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2025 TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2025 TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2025 TO service_role;

CREATE TABLE public.partition_events_2025_default PARTITION OF public.partition_events_2025 DEFAULT;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2025_default TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2025_default TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2025_default TO service_role;

CREATE TABLE public.partition_events_2025_eu PARTITION OF public.partition_events_2025 FOR VALUES IN ('eu');

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2025_eu TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2025_eu TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_2025_eu TO service_role;

CREATE TABLE public.partition_events_default PARTITION OF public.partition_events DEFAULT;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_default TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_default TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_default TO service_role;

CREATE TABLE public.partition_events_obsolete PARTITION OF public.partition_events FOR VALUES FROM ('2022-01-01') TO ('2023-01-01');

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_obsolete TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_obsolete TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_obsolete TO service_role;

CREATE TABLE public.partition_events_retire PARTITION OF public.partition_events FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_retire TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_retire TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_events_retire TO service_role;

CREATE TABLE public.partition_metrics (
  id     bigint  NOT NULL,
  bucket integer NOT NULL
) PARTITION BY HASH (bucket);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_metrics TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_metrics TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_metrics TO service_role;

CREATE TABLE public.partition_metrics_p0 PARTITION OF public.partition_metrics FOR VALUES WITH (modulus 2, remainder 0);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_metrics_p0 TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_metrics_p0 TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.partition_metrics_p0 TO service_role;

CREATE TABLE public.transition_anchor (
  id      integer NOT NULL,
  payload text    NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\207-partition-lifecycle-legacy\supabase\migrations\20260817180446_207_partition_lifecycle_baseline.sql
Found drop statements in schema diff. Please double check if these are expected:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net
Migration failed to apply: ERROR: extension "pg_net" does not exist (SQLSTATE 42704)
At statement: 0
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\207-partition-lifecycle-legacy\supabase\.temp\pgdelta\debug\20260817-180446-apply-error

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
At statement: 0
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net
```

### Sync (legacy)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The declarative baseline failed, so the range, list, hash, default and multilevel partition add, drop, detach, and safe populated bound evolution transition was skipped.
```
<!-- declarative-schema-command-result case="207-partition-lifecycle" engine="legacy" command="sync" status="ERROR" -->

