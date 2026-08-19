# Case: 261-database-broadcast-helper-evolution

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.broadcast_orders_261 (
  id bigint primary key,
  tenant_id integer not null,
  payload text not null
);

create table public.broadcast_identity_261 (
  id integer primary key,
  table_oid oid not null,
  function_oid oid not null,
  trigger_oid oid not null
);

create function public.broadcast_order_changes_261()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.broadcast_changes(
    'orders:' || coalesce(new.id, old.id)::text,
    tg_op,
    tg_op,
    tg_table_name,
    tg_table_schema,
    new,
    old
  );
  return null;
end;
$$;

create trigger broadcast_order_changes_261
after insert or update or delete on public.broadcast_orders_261
for each row execute function public.broadcast_order_changes_261();
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.broadcast_orders_261 (
  id bigint primary key,
  tenant_id integer not null,
  payload text not null
);

create table public.broadcast_identity_261 (
  id integer primary key,
  table_oid oid not null,
  function_oid oid not null,
  trigger_oid oid not null
);

create function public.broadcast_order_changes_261()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.broadcast_changes(
    'tenant:' || coalesce(new.tenant_id, old.tenant_id)::text || ':orders',
    lower(tg_op),
    tg_op,
    tg_table_name,
    tg_table_schema,
    new,
    old
  );
  return null;
end;
$$;

create trigger broadcast_order_changes_261
after insert or update or delete on public.broadcast_orders_261
for each row execute function public.broadcast_order_changes_261();
```

## Representative data setup

```sql
-- Invariant: helper replacement preserves table, function, trigger, and data identities.
insert into public.transition_anchor values (261, 'database-broadcast-helper');
alter table public.broadcast_orders_261 disable trigger broadcast_order_changes_261;
insert into public.broadcast_orders_261 values (1, 261, 'preserved');
alter table public.broadcast_orders_261 enable trigger broadcast_order_changes_261;
insert into public.broadcast_identity_261
select
  1,
  'public.broadcast_orders_261'::regclass::oid,
  'public.broadcast_order_changes_261()'::regprocedure::oid,
  (select oid from pg_trigger
   where tgrelid = 'public.broadcast_orders_261'::regclass
     and tgname = 'broadcast_order_changes_261');
```

## CLI-generated baseline migration files

_(no files generated)_

## Declared migration-shape assertion

- Raw sync result: **SKIPPED**
- Assertion: **SKIPPED**
- The safety assertion could not run because the declarative baseline failed.

## Generated transition migration files

_(no files generated)_

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `30.5s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 261_database_broadcast_helper_evolution_baseline --debug`
- Result: **ERROR**
- Duration: `50.0s`
- Exit code: `1`

```text
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
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.email_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.inserted_at message=edge default:realtime.messages_2026_08_16.inserted_at -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.updated_at message=edge default:vault.secrets.updated_at -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.updated_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.inserted_at message=edge default:realtime.messages_2026_08_17.inserted_at -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.key_id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.key_id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.inserted_at message=edge default:realtime.messages_2026_08_19.inserted_at -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_19.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_19.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.created_at message=edge default:vault.secrets.created_at -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.created_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.id message=edge default:realtime.messages_2026_08_17.id -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> column:realtime.subscription.claims references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.phone_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:vault.secrets_name_idx message=edge index:vault.secrets_name_idx -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.name message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.inserted_at message=edge default:realtime.messages_2026_08_18.inserted_at -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.private message=edge default:realtime.messages_2026_08_19.private -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.nonce message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.id message=edge default:vault.secrets.id -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:vault.secrets.secrets_pkey message=edge constraint:vault.secrets.secrets_pkey -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.id message=edge default:realtime.messages_2026_08_16.id -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.private message=edge default:realtime.messages_2026_08_16.private -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.identities.email message=edge default:auth.identities.email -[depends]-> column:auth.identities.identity_data references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_20.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_20.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.id message=edge default:realtime.messages_2026_08_18.id -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.updated_at message=edge default:realtime.messages_2026_08_18.updated_at -[depends]-> column:realtime.messages_2026_08_18.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_20.private message=edge default:realtime.messages_2026_08_20.private -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.updated_at message=edge default:realtime.messages_2026_08_19.updated_at -[depends]-> column:realtime.messages_2026_08_19.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.id message=edge default:realtime.messages_2026_08_19.id -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.nonce message=edge column:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.private message=edge default:realtime.messages_2026_08_17.private -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_20.id message=edge default:realtime.messages_2026_08_20.id -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
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
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_20.inserted_at message=edge default:realtime.messages_2026_08_20.inserted_at -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
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
This supabase\database tree looks like a legacy pg-delta export.
pg-delta next only loads extensions the tree declares; legacy exports omitted
platform extensions and extension-managed objects like cron jobs.

  Legacy-implicit extensions: pgcrypto, uuid-ossp

Do not apply a sync generated from this tree — it can drop extensions or unschedule jobs.
Upgrade without changing the active supabase\database tree:

  supabase db schema declarative generate --local --overwrite --output-dir 'supabase\database-next' --experimental
  # review supabase\database-next
  Remove-Item -Recurse -Force -ErrorAction Stop 'supabase\database'; Move-Item 'supabase\database-next' 'supabase\database'
  supabase db schema declarative sync --no-apply --experimental
```


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The declarative baseline failed, so the replace a database Broadcast helper while preserving its trigger transition was skipped.
```
<!-- declarative-schema-command-result case="261-database-broadcast-helper-evolution" engine="next" command="sync" status="ERROR" -->

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
- Duration: `32.6s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name 261_database_broadcast_helper_evolution_baseline --debug`
- Result: **ERROR**
- Duration: `44.4s`
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
Applied 5 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

DROP EXTENSION pg_net;

CREATE FUNCTION public.broadcast_order_changes_261()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
  perform realtime.broadcast_changes(
    'orders:' || coalesce(new.id, old.id)::text,
    tg_op,
    tg_op,
    tg_table_name,
    tg_table_schema,
    new,
    old
  );
  return null;
end;
$function$;

CREATE TABLE public.broadcast_identity_261 (
  id           integer NOT NULL,
  table_oid    oid     NOT NULL,
  function_oid oid     NOT NULL,
  trigger_oid  oid     NOT NULL
);

ALTER TABLE public.broadcast_identity_261
  ADD CONSTRAINT broadcast_identity_261_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.broadcast_identity_261 TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.broadcast_identity_261 TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.broadcast_identity_261 TO service_role;

CREATE TABLE public.broadcast_orders_261 (
  id        bigint  NOT NULL,
  tenant_id integer NOT NULL,
  payload   text    NOT NULL
);

ALTER TABLE public.broadcast_orders_261
  ADD CONSTRAINT broadcast_orders_261_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.broadcast_orders_261 TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.broadcast_orders_261 TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.broadcast_orders_261 TO service_role;

CREATE TRIGGER broadcast_order_changes_261
  AFTER INSERT OR DELETE OR UPDATE ON public.broadcast_orders_261
  FOR EACH ROW
  EXECUTE FUNCTION public.broadcast_order_changes_261();

CREATE TABLE public.transition_anchor (
  case_no integer NOT NULL,
  payload text    NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (case_no);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\261-database-broadcast-helper-evolution-legacy\supabase\migrations\20260817233334_261_database_broadcast_helper_evolution_baseline.sql
Found drop statements in schema diff. Please double check if these are expected:
DROP EXTENSION pg_net
Migration failed to apply: ERROR: extension "pg_net" does not exist (SQLSTATE 42704)
At statement: 1
DROP EXTENSION pg_net

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\261-database-broadcast-helper-evolution-legacy\supabase\.temp\pgdelta\debug\20260817-233334-apply-error

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
The declarative baseline failed, so the replace a database Broadcast helper while preserving its trigger transition was skipped.
```
<!-- declarative-schema-command-result case="261-database-broadcast-helper-evolution" engine="legacy" command="sync" status="ERROR" -->

