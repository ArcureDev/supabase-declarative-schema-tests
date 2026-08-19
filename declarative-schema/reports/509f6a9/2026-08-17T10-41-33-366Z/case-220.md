# Case: 220-realtime-publication-membership

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.realtime_feed_220 (
  id bigint generated always as identity primary key,
  payload text not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.realtime_feed_220 (
  id bigint generated always as identity primary key,
  payload text not null
);
alter table public.realtime_feed_220 replica identity full;
alter publication supabase_realtime add table public.realtime_feed_220;
```

## Representative data setup

```sql
insert into public.transition_anchor (case_no, payload)
select
  220,
  jsonb_build_object(
    'feed_oid', feed.oid,
    'feed_owner', feed.relowner,
    'feed_acl', coalesce(to_jsonb(feed.relacl), 'null'::jsonb),
    'publication_oid', publication.oid
  )::text
from pg_class as feed
cross join pg_publication as publication
where feed.oid = 'public.realtime_feed_220'::regclass
  and publication.pubname = 'supabase_realtime';

insert into public.realtime_feed_220 (payload)
values ('preserved realtime row');
```

## CLI-generated baseline migration files

### `20260817193813_220_realtime_publication_membership_baseline.sql`

```sql
create table "public"."realtime_feed_220" (
  "id"      bigint generated always as identity not null,
  "payload" text   not null,
  constraint "realtime_feed_220_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

grant maintain, references, trigger, truncate on table "public"."realtime_feed_220" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."realtime_feed_220" to "postgres";

grant maintain, references, trigger, truncate on table "public"."realtime_feed_220" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817193853_declarative_sync.sql`

```sql
alter table "public"."realtime_feed_220"
  replica identity full;

alter publication "supabase_realtime" add table "public"."realtime_feed_220";
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

- Command: `npx supabase db schema declarative sync --apply --name 220_realtime_publication_membership_baseline --debug`
- Result: **OK**
- Duration: `59.7s`

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
- Duration: `40.2s`
<!-- declarative-schema-command-result case="220-realtime-publication-membership" engine="next" command="sync" status="OK" -->

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
- Duration: `39.7s`
<!-- declarative-schema-command-result case="220-realtime-publication-membership" engine="next" command="sync-verification" status="OK" -->

