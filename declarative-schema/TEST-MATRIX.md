# pg-delta test matrix

This document is both the inventory of implemented fixtures and the roadmap for
testing pg-delta through the Supabase CLI. A checked snapshot item has a matching
SQL file under `migrations/`; a checked transition item has a matching directory
under `transitions/`. An unchecked item is planned but not implemented.

## What the current 180 fixtures prove

Each current fixture starts from one migration, generates a declarative schema,
removes the migration from the isolated working copy, and asks the CLI to
regenerate a migration from that final declarative state. These are valuable
**snapshot round-trip** tests: they check that PostgreSQL and Supabase database
objects survive export and regeneration.

They are not yet **state-transition** tests. Even when a fixture contains an
`ALTER` statement, pg-delta sees only the resulting state, so it does not prove
that pg-delta will choose the corresponding `ALTER` when moving an existing
database from state A to state B. Rename safety, data preservation, dependency
ordering, destructive-change warnings, idempotence, and multi-release evolution
therefore need a separate fixture model described after the implemented panel.

## Implemented foundations

- [x] 001 Basic table (`01-basic-table.sql`)
- [x] 002 Enum type (`02-enum-type.sql`)
- [x] 003 Domain type (`03-domain-type.sql`)
- [x] 004 Sequence (`04-sequence.sql`)
- [x] 005 View (`05-view.sql`)
- [x] 006 SQL function (`06-sql-function.sql`)
- [x] 007 Row trigger (`07-trigger.sql`)
- [x] 008 RLS policy (`08-rls-policy.sql`)
- [x] 009 Publication (`09-publication.sql`)
- [x] 010 Text search configuration (`10-text-search-configuration.sql`)
- [x] 011 Schema (`11-schema.sql`)
- [x] 012 Named table check constraint (`12-table-check-constraint.sql`)
- [x] 013 Foreign key with referential actions (`13-foreign-key.sql`)
- [x] 014 Expression index (`14-expression-index.sql`)
- [x] 015 Partial index (`15-partial-index.sql`)
- [x] 016 Materialized view (`16-materialized-view.sql`)
- [x] 017 Composite type (`17-composite-type.sql`)
- [x] 018 Range type (`18-range-type.sql`)
- [x] 019 SQL procedure (`19-sql-procedure.sql`)
- [x] 020 User-defined aggregate (`20-user-defined-aggregate.sql`)

## Tables, columns, constraints, and partitioning

- [x] 021 Generated stored column (`21-generated-stored-column.sql`)
- [x] 022 Identity column options (`22-identity-column-options.sql`)
- [x] 023 Unlogged table (`23-unlogged-table.sql`)
- [x] 024 Typed table (`24-typed-table.sql`)
- [x] 025 Table with composite primary key (`25-composite-primary-key.sql`)
- [x] 026 Unique constraint (`26-unique-constraint.sql`)
- [x] 027 Unique constraint with `NULLS NOT DISTINCT` (`27-unique-nulls-not-distinct.sql`)
- [x] 028 Exclusion constraint (`28-exclusion-constraint.sql`)
- [x] 029 Deferrable unique constraint (`29-deferrable-unique-constraint.sql`)
- [x] 030 Deferrable foreign key (`30-deferrable-foreign-key.sql`)
- [x] 031 Self-referencing foreign key (`31-self-referencing-foreign-key.sql`)
- [x] 032 Multi-column foreign key (`32-multi-column-foreign-key.sql`)
- [x] 033 Column default expression (`33-column-default-expression.sql`)
- [x] 034 Column collation (`34-column-collation.sql`)
- [x] 035 Column compression setting (`35-column-compression-setting.sql`)
- [x] 036 Table storage parameters (`36-table-storage-parameters.sql`)
- [x] 037 Table tablespace (`37-table-tablespace.sql`)
- [x] 038 Table inheritance (`38-table-inheritance.sql`)
- [x] 039 Range-partitioned table (`39-range-partitioned-table.sql`)
- [x] 040 List-partitioned table (`40-list-partitioned-table.sql`)
- [x] 041 Hash-partitioned table (`41-hash-partitioned-table.sql`)
- [x] 042 Default partition (`42-default-partition.sql`)
- [x] 043 Multi-level partitioning (`43-multi-level-partitioning.sql`)
- [x] 044 Partition constraint and bound (`44-partition-constraint-and-bound.sql`)
- [x] 045 Table replica identity (`45-table-replica-identity.sql`)
- [x] 046 Table and column comments (`46-table-and-column-comments.sql`)
- [x] 047 `ALTER TABLE` add, rename, and drop column (`47-alter-table-add-rename-and-drop-column.sql`)
- [x] 048 `ALTER TABLE` change column type with `USING` (`48-alter-table-change-column-type-with-using.sql`)
- [x] 049 `ALTER TABLE` set and drop default (`49-alter-table-set-and-drop-default.sql`)
- [x] 050 `ALTER TABLE` set and drop `NOT NULL` (`50-alter-table-set-and-drop-not-null.sql`)

## Indexes and physical design

- [x] 051 B-tree index (`51-btree-index.sql`)
- [x] 052 Unique index (`52-unique-index.sql`)
- [x] 053 Multi-column index (`53-multi-column-index.sql`)
- [x] 054 Index sort order and null placement (`54-index-sort-order-and-null-placement.sql`)
- [x] 055 Covering index with `INCLUDE` (`55-covering-index-with-include.sql`)
- [x] 056 Hash index (`56-hash-index.sql`)
- [x] 057 GIN index (`57-gin-index.sql`)
- [x] 058 GiST index (`58-gist-index.sql`)
- [x] 059 BRIN index (`59-brin-index.sql`)
- [x] 060 SP-GiST index (`60-sp-gist-index.sql`)
- [x] 061 Index operator class (`61-index-operator-class.sql`)
- [x] 062 Index collation (`62-index-collation.sql`)
- [x] 063 Index storage parameters (`63-index-storage-parameters.sql`)
- [x] 064 Index tablespace (`64-index-tablespace.sql`)
- [x] 065 Index on partitioned table (`65-index-on-partitioned-table.sql`)
- [x] 066 Concurrent-index final schema (`66-concurrent-index-final-schema.sql`)
- [x] 067 Renamed index (`67-renamed-index.sql`)
- [x] 068 Clustered index marker (`68-clustered-index-marker.sql`)
- [x] 069 Replica-identity index (`69-replica-identity-index.sql`)
- [x] 070 Extension-backed `pg_trgm` index (`70-extension-backed-pg-trgm-index.sql`)

## Views, routines, and triggers

- [x] 071 View with `security_invoker` (`71-view-with-security-invoker.sql`)
- [x] 072 View with `security_barrier` (`72-view-with-security-barrier.sql`)
- [x] 073 Recursive view (`73-recursive-view.sql`)
- [x] 074 View check option (`74-view-check-option.sql`)
- [x] 075 Materialized view with indexes (`75-materialized-view-with-indexes.sql`)
- [x] 076 PL/pgSQL function (`76-plpgsql-function.sql`)
- [x] 077 Function returning table (`77-function-returning-table.sql`)
- [x] 078 Function returning set (`78-function-returning-set.sql`)
- [x] 079 Function with default arguments (`79-function-with-default-arguments.sql`)
- [x] 080 Function with named and `OUT` arguments (`80-function-with-named-and-out-arguments.sql`)
- [x] 081 Variadic function (`81-variadic-function.sql`)
- [x] 082 Function volatility and parallel safety (`82-function-volatility-and-parallel-safety.sql`)
- [x] 083 Security-definer function with fixed search path (`83-security-definer-function-with-fixed-search-path.sql`)
- [x] 084 Function configuration parameters (`84-function-configuration-parameters.sql`)
- [x] 085 Procedure with transaction-safe body (`85-procedure-with-transaction-safe-body.sql`)
- [x] 086 `BEFORE` statement trigger (`86-before-statement-trigger.sql`)
- [x] 087 `AFTER` row trigger with arguments (`87-after-row-trigger-with-arguments.sql`)
- [x] 088 Constraint trigger (`88-constraint-trigger.sql`)
- [x] 089 `INSTEAD OF` view trigger (`89-instead-of-view-trigger.sql`)
- [x] 090 Trigger with `WHEN` condition (`90-trigger-with-when-condition.sql`)
- [x] 091 Truncate trigger (`91-truncate-trigger.sql`)
- [x] 092 Transition-table trigger (`92-transition-table-trigger.sql`)
- [x] 093 Disabled trigger (`93-disabled-trigger.sql`)
- [x] 094 Event trigger on DDL command end (`94-event-trigger-on-ddl-command-end.sql`)
- [x] 095 Event trigger on SQL drop (`95-event-trigger-on-sql-drop.sql`)

## Types, domains, operators, and language objects

- [x] 096 Enum type with multiple labels and ordering (`96-enum-type-with-multiple-labels-and-ordering.sql`)
- [x] 097 Enum value added with `ALTER TYPE` (`97-enum-value-added-with-alter-type.sql`)
- [x] 098 Domain with default and `NOT NULL` (`98-domain-with-default-and-not-null.sql`)
- [x] 099 Domain with multiple constraints (`99-domain-with-multiple-constraints.sql`)
- [x] 100 Multirange type (`100-multirange-type.sql`)
- [x] 101 Base type shell definition (`101-base-type-shell-definition.sql`)
- [x] 102 Array use of a custom type (`102-array-use-of-a-custom-type.sql`)
- [x] 103 Custom cast (`103-custom-cast.sql`)
- [x] 104 Custom operator (`104-custom-operator.sql`)
- [x] 105 Custom operator class (`105-custom-operator-class.sql`)
- [x] 106 Custom operator family (`106-custom-operator-family.sql`)
- [x] 107 User-defined window aggregate (`107-user-defined-window-aggregate.sql`)
- [x] 108 Ordered-set aggregate (`108-ordered-set-aggregate.sql`)
- [x] 109 Procedural language registration (`109-procedural-language-registration.sql`)
- [x] 110 Transform for a procedural language (`110-transform-for-a-procedural-language.sql`)

## Schemas, sequences, ownership, and privileges

- [x] 111 Schema authorization (`111-schema-authorization.sql`)
- [x] 112 Renamed schema (`112-renamed-schema.sql`)
- [x] 113 Sequence ownership by table column (`113-sequence-ownership-by-table-column.sql`)
- [x] 114 Cycling sequence (`114-cycling-sequence.sql`)
- [x] 115 Descending sequence (`115-descending-sequence.sql`)
- [x] 116 Sequence cache and bounds (`116-sequence-cache-and-bounds.sql`)
- [x] 117 Sequence data type (`117-sequence-data-type.sql`)
- [x] 118 Role creation (`118-role-creation.sql`)
- [x] 119 Role membership (`119-role-membership.sql`)
- [x] 120 Role configuration setting (`120-role-configuration-setting.sql`)
- [x] 121 Table grants (`121-table-grants.sql`)
- [x] 122 Column-level grants (`122-column-level-grants.sql`)
- [x] 123 Sequence grants (`123-sequence-grants.sql`)
- [x] 124 Function execution grants (`124-function-execution-grants.sql`)
- [x] 125 Schema usage and create grants (`125-schema-usage-and-create-grants.sql`)
- [x] 126 Default table privileges (`126-default-table-privileges.sql`)
- [x] 127 Default sequence privileges (`127-default-sequence-privileges.sql`)
- [x] 128 Default function privileges (`128-default-function-privileges.sql`)
- [x] 129 Object ownership transfer (`129-object-ownership-transfer.sql`)
- [x] 130 Security labels (`130-security-labels.sql`)

## Row-level security and API-facing security

- [x] 131 RLS enabled without policies (`131-rls-enabled-without-policies.sql`)
- [x] 132 RLS forced (`132-rls-forced.sql`)
- [x] 133 Permissive select policy (`133-permissive-select-policy.sql`)
- [x] 134 Restrictive select policy (`134-restrictive-select-policy.sql`)
- [x] 135 Insert policy with `WITH CHECK` (`135-insert-policy-with-with-check.sql`)
- [x] 136 Update policy with `USING` and `WITH CHECK` (`136-update-policy-with-using-and-with-check.sql`)
- [x] 137 Delete policy (`137-delete-policy.sql`)
- [x] 138 All-commands policy (`138-all-commands-policy.sql`)
- [x] 139 Policy for multiple roles (`139-policy-for-multiple-roles.sql`)
- [x] 140 Policy using `auth.uid()` (`140-policy-using-auth-uid.sql`)
- [x] 141 Policy using JWT claims (`141-policy-using-jwt-claims.sql`)
- [x] 142 Policy calling a security-definer helper (`142-policy-calling-a-security-definer-helper.sql`)
- [x] 143 Policy on a partitioned table (`143-policy-on-a-partitioned-table.sql`)
- [x] 144 Policy rename and expression alteration (`144-policy-rename-and-expression-alteration.sql`)
- [x] 145 Data API exposed custom schema grants (`145-data-api-exposed-custom-schema-grants.sql`)

## Replication and publications

- [x] 146 Publication for all tables (`146-publication-for-all-tables.sql`)
- [x] 147 Publication for multiple tables (`147-publication-for-multiple-tables.sql`)
- [x] 148 Publication with insert-only operations (`148-publication-with-insert-only-operations.sql`)
- [x] 149 Publication with update and delete operations (`149-publication-with-update-and-delete-operations.sql`)
- [x] 150 Publication with truncate operations (`150-publication-with-truncate-operations.sql`)
- [x] 151 Publication column list (`151-publication-column-list.sql`)
- [x] 152 Publication row filter (`152-publication-row-filter.sql`)
- [x] 153 Publication partition-root option (`153-publication-partition-root-option.sql`)
- [x] 154 Publication add and drop table (`154-publication-add-and-drop-table.sql`)
- [x] 155 Publication schema membership (`155-publication-schema-membership.sql`)
- [x] 156 Logical replication slot metadata boundary (`156-logical-replication-slot-metadata-boundary.sql`)
- [x] 157 Replica identity default (`157-replica-identity-default.sql`)
- [x] 158 Replica identity full (`158-replica-identity-full.sql`)
- [x] 159 Replica identity nothing (`159-replica-identity-nothing.sql`)
- [x] 160 Supabase Realtime publication membership (`160-supabase-realtime-publication-membership.sql`)

## Full-text search, collations, and conversions

- [x] 161 Text search dictionary (`161-text-search-dictionary.sql`)
- [x] 162 Text search template (`162-text-search-template.sql`)
- [x] 163 Text search parser (`163-text-search-parser.sql`)
- [x] 164 Text search configuration mapping replacement (`164-text-search-configuration-mapping-replacement.sql`)
- [x] 165 Text search configuration mapping addition (`165-text-search-configuration-mapping-addition.sql`)
- [x] 166 Text search configuration mapping drop (`166-text-search-configuration-mapping-drop.sql`)
- [x] 167 Text search configuration rename (`167-text-search-configuration-rename.sql`)
- [x] 168 ICU collation (`168-icu-collation.sql`)
- [x] 169 libc collation (`169-libc-collation.sql`)
- [x] 170 Encoding conversion (`170-encoding-conversion.sql`)

## Extensions, foreign data, and Supabase-specific objects

- [x] 171 Extension in `extensions` schema (`171-extension-in-extensions-schema.sql`)
- [x] 172 Extension version and cascade options (`172-extension-version-and-cascade-options.sql`)
- [x] 173 Extension-owned object boundary (`173-extension-owned-object-boundary.sql`)
- [x] 174 Foreign data wrapper (`174-foreign-data-wrapper.sql`)
- [x] 175 Foreign server (`175-foreign-server.sql`)
- [x] 176 User mapping (`176-user-mapping.sql`)
- [x] 177 Foreign table (`177-foreign-table.sql`)
- [x] 178 Supabase Vault secret wrapper objects (`178-supabase-vault-secret-wrapper-objects.sql`)
- [x] 179 Supabase Auth hook function and grants (`179-supabase-auth-hook-function-and-grants.sql`)
- [x] 180 Supabase Database Webhook trigger using `pg_net` (`180-supabase-database-webhook-trigger-using-pg-net.sql`)

## Planned transition suite

The remaining roadmap should be implemented as transition fixtures, not only as
more snapshot fixtures. Each logical case has a baseline state A, a desired
state B, expected migration properties, and post-apply assertions.

### Implemented P0 transitions

- [x] 181 Rename ambiguity without a hint warns or refuses safely
  (`transitions/181-rename-ambiguity/`)
- [x] 182 Populated-column changes preserve table identity and existing rows,
  apply new defaults correctly, and converge (`transitions/182-populated-column-changes/`)
- [x] 183 Destructive populated-column drop warns or refuses without changing
  state A (`transitions/183-destructive-change-warning/`)
- [x] 184 Dependency chains and diamonds are generated in topological order,
  preserve populated source identity, apply successfully, and converge
  (`transitions/184-dependency-ordering/`)
- [x] 185 Identical declarations produce no migration and leave identity,
  comments, and populated rows unchanged (`transitions/185-no-op-convergence/`)
- [x] 186 A populated table alteration preserves grants, RLS, and policy state
  (`transitions/186-grants-rls-preservation/`)
- [x] 187 Repeated non-applied generation produces byte-identical normalized
  migration output (`transitions/187-deterministic-output/`)
- [x] 188 A failed data-dependent migration rolls back cleanly, can be repaired,
  retries successfully, and converges (`transitions/188-recovery-after-failure/`)

### Implemented production and advanced transition catalogue

Most fixtures use a manifest-driven applicable-transition lifecycle. Each
declares required and forbidden migration shapes, preserves a populated anchor
object, verifies target catalogs and behavior, and requires a converged second
diff. Cases 206, 211, 218, and 221 instead bootstrap state A directly and require
stable capability/scope diagnostics without applying or changing the database.

- [x] 189 Schema and table creation (`transitions/189-schema-table-evolution/`)
- [x] 190 Table persistence (`transitions/190-table-persistence/`)
- [x] 191 Table storage parameters (`transitions/191-table-storage-parameters/`)
- [x] 192 Populated batch columns (`transitions/192-populated-batch-columns/`)
- [x] 193 Implicit type widening (`transitions/193-implicit-type-widening/`)
- [x] 194 Column default evolution (`transitions/194-column-default-evolution/`)
- [x] 195 Column `NOT NULL` evolution (`transitions/195-column-not-null/`)
- [x] 196 Identity generation mode (`transitions/196-identity-generation-mode/`)
- [x] 197 Generated column addition (`transitions/197-generated-column-addition/`)
- [x] 198 Sequence options (`transitions/198-sequence-options/`)
- [x] 199 Sequence ownership (`transitions/199-sequence-ownership/`)
- [x] 200 Boundary data-shape preservation (`transitions/200-data-shape-preservation/`)
- [x] 201 Constraint property evolution (`transitions/201-constraint-property-evolution/`)
- [x] 202 Foreign-key validation and properties (`transitions/202-foreign-key-validation/`)
- [x] 203 Index/constraint linkage (`transitions/203-index-constraint-linkage/`)
- [x] 204 Index definition evolution (`transitions/204-index-definition-evolution/`)
- [x] 205 Advanced index markers (`transitions/205-advanced-index-markers/`)
- [x] 206 Extended-statistics capability diagnostic with rewrite-rule state
  preservation (`transitions/206-statistics-and-rules/`)
- [x] 207 Partition lifecycle (`transitions/207-partition-lifecycle/`)
- [x] 208 Partition attachment and inheritance (`transitions/208-partition-attach-and-inheritance/`)
- [x] 209 Enum and domain evolution (`transitions/209-enum-domain-evolution/`)
- [x] 210 Composite and range evolution (`transitions/210-composite-range-evolution/`)
- [x] 211 Cast/operator creation and restricted-role transform boundary
  (`transitions/211-cast-operator-transform-creation/`)
- [x] 212 View and materialized-view evolution
  (`transitions/212-view-materialized-view-evolution/`)
- [x] 213 Routine and procedure replacement
  (`transitions/213-routine-procedure-replacement/`)
- [x] 214 Aggregate definition evolution
  (`transitions/214-aggregate-definition-evolution/`)
- [x] 215 Trigger definition evolution (`transitions/215-trigger-definition-evolution/`)
- [x] 216 Event-trigger enablement (`transitions/216-event-trigger-enable-evolution/`)
- [x] 217 Cross-kind dependency ordering
  (`transitions/217-cross-kind-dependency-ordering/`)
- [x] 218 Role/ACL database-scope boundary diagnostic
  (`transitions/218-role-membership-acl-hardening/`)
- [x] 219 RLS policy hardening (`transitions/219-rls-policy-hardening/`)
- [x] 220 Realtime publication membership
  (`transitions/supabase/220-realtime-publication-membership/`)
- [x] 221 Text-search mapping capability
  (`transitions/221-text-search-mapping-transition/`)
- [x] 222 Collation and conversion creation
  (`transitions/222-collation-conversion-create/`)
- [x] 223 Extension-dependent index (`transitions/223-extension-dependent-index/`)
- [x] 224 FDW option change and secret redaction
  (`transitions/224-fdw-option-redaction/`)
- [x] 225 Managed-schema boundary (`transitions/supabase/225-managed-schema-boundary/`)
- [x] 226 `auth.uid()` policy hardening
  (`transitions/supabase/226-auth-uid-policy-hardening/`)
- [x] 227 Storage policy hardening
  (`transitions/supabase/227-storage-object-policy-hardening/`)
- [x] 228 Realtime message policy hardening
  (`transitions/supabase/228-realtime-message-policy-hardening/`)
- [x] 229 `pg_net` webhook replacement
  (`transitions/supabase/229-pg-net-webhook-replacement/`)
- [x] 230 Vault secret data boundary
  (`transitions/supabase/230-vault-secret-data-boundary/`)
- [x] 231 Cron job data boundary (`transitions/supabase/231-cron-job-data-boundary/`)
- [x] 232 Queue message data boundary
  (`transitions/supabase/232-queue-message-data-boundary/`)
- [x] 233 pgvector HNSW addition (`transitions/233-pgvector-index-addition/`)
- [x] 234 PostGIS GiST addition (`transitions/234-postgis-index-addition/`)
- [x] 235 pg_graphql ACL exposure
  (`transitions/supabase/235-pg-graphql-acl-exposure/`)
- [x] 236 Wrappers server options
  (`transitions/supabase/236-wrappers-openapi-server-options/`)
- [x] 237 Tenant, modular API, and GraphQL release
  (`transitions/supabase/237-tenant-modular-graphql-release/`)
- [x] 238 Commerce, booking, and billing release
  (`transitions/238-commerce-booking-billing-release/`)
- [x] 239 Realtime/social managed-boundary release
  (`transitions/supabase/239-realtime-social-managed-boundaries/`)
- [x] 240 RAG, search, and extension release
  (`transitions/240-rag-search-extension-release/`)
- [x] 241 Geospatial analytics release
  (`transitions/supabase/241-geospatial-analytics-integration/`)
- [x] 242 Background-processing release
  (`transitions/242-background-processing-release/`)
- [x] 243 Audit-ledger/archive release
  (`transitions/243-audit-ledger-archive-release/`)
- [x] 244 Legacy staged normalization
  (`transitions/244-legacy-staged-normalization/`)

### Estimated size

The word “exhaustive” means practical coverage of every supported object family,
operation class, ambiguity class, and important interaction. It cannot mean the
literal Cartesian product of every PostgreSQL feature, version, data shape, and
Supabase configuration.

| Area | Estimated logical cases |
| --- | ---: |
| Existing snapshot fixtures | 180 |
| Missing PostgreSQL object variants | 40–70 |
| Rename, move, and identity preservation | 70–100 |
| Table, column, and populated-data evolution | 100–140 |
| Constraints, indexes, statistics, and partitions | 100–140 |
| Types, views, routines, and triggers | 100–140 |
| Roles, grants, RLS, and logical replication | 70–100 |
| Extensions, FDWs, and advanced objects | 60–90 |
| Dependency ordering and destructive changes | 80–120 |
| Supabase database integrations and boundaries | 100–150 |
| Compound, realistic, multi-release projects | 80–150 |
| **Practical comprehensive total** | **about 980–1,380** |

That total counts test scenarios, not necessarily one migration file per row.
Evolution fixtures normally need both A and B. Shared baselines, table-driven
generators, and parameterized assertions should reduce the hand-authored suite
to roughly 600–850 checked-in fixture definitions. Full Supabase product
coverage also needs approximately 15–25 configuration variants, 10–20 small
Edge Functions, seed/data fixtures, and behavioral assertions outside pg-delta.

### Suggested delivery order

- [x] **P0 — safety:** no-op convergence, rename ambiguity, populated-column
  changes, destructive warnings, dependency ordering, grants/RLS preservation,
  deterministic output, and recovery after failure.
- [x] **P1 — common production evolution:** tables, constraints, indexes,
  functions, views, triggers, enums, partitions, publications, Auth, Storage,
  Realtime, Vault, Cron, Queues, and webhooks (cases 189–244).
- [x] **P2 — advanced PostgreSQL:** custom types/operators, text search,
  collations, conversions, FDWs, extension lifecycle, event triggers, and
  ownership/security boundaries (cases 206, 210–224, 233–244).
- [ ] **P3 — scale and portability:** large populated tables, concurrent
  activity, version/platform matrices, linked projects, hosted projects, and
  realistic multi-release applications.

## Evolution fixture contract

Every transition case should perform this lifecycle:

1. Copy its self-contained Supabase project with declarative baseline state A
   and run `sync --apply`, retaining the CLI-generated migration as the history
   baseline.
2. Insert representative data and capture object identities where relevant.
3. Edit or replace the declarative input with desired state B.
4. Generate the migration without applying it.
5. Assert the SQL shape and safety classification.
6. For warning/refusal safety cases, stop and assert that state A is unchanged.
7. Otherwise, apply the generated migration.
8. Assert catalogs, data, identity, privileges, dependencies, and behavior.
9. Generate again and require an empty second diff.
10. Where meaningful, test B to A and A to B to C as separate transitions.

The harness should retain the generated SQL and diagnostics for review. A test
must fail if pg-delta reaches the right final schema through a needlessly
destructive operation.

### Universal operation matrix

Apply the following operations to every object family that supports them:

- [ ] Absent to present creates the object once.
- [ ] Identical A and B produces no migration.
- [ ] Present to absent drops the object with the expected warning or policy.
- [ ] Add, remove, and change each mutable property independently.
- [ ] Rename the object without recreating it.
- [ ] Move it to another schema with native SET SCHEMA where supported.
- [ ] Rename and alter it in the same transition.
- [ ] Change owner, comment, security label, ACL, and dependency references.
- [ ] Create or alter several independent objects in a stable order.
- [ ] Apply changes through a dependency chain and through a dependency diamond.
- [ ] Exercise legal dependency cycles and report impossible ones clearly.
- [ ] Convert between compatible object kinds where PostgreSQL supports it.
- [ ] Warn or refuse where the only implementation is destructive.
- [ ] Test forward, reverse, and three-release A to B to C evolution.
- [ ] Repeat generation and require byte-stable or normalized-stable output.

## Rename and identity safety

A declarative before/after pair does not, by itself, prove that an object was
renamed. The same states can mean “drop the old object and create an unrelated
new object.” The contract must therefore be explicit:

- [ ] With an explicit rename hint, require the native PostgreSQL RENAME form.
- [x] Without a hint, ambiguous drop/add pairs warn or fail safely
  (`transitions/181-rename-ambiguity/`).
- [ ] If heuristic matching is supported, expose the inference and require
  confirmation rather than silently risking data loss.
- [ ] An explicit drop plus add remains possible and is distinguishable from a
  rename.

Cover table, column, schema, constraint, index, sequence, view, materialized
view, function/procedure signature, trigger, policy, type, enum type, domain,
publication, role, server, and foreign-table renames where PostgreSQL permits
them. For each relevant family, include:

- [ ] A simple rename and a rename with all dependents present.
- [ ] Rename plus type/default/nullability/property change.
- [ ] Several unambiguous renames in one generation.
- [ ] Chained renames A to B to C and the reverse direction.
- [ ] Name swaps, cycles, and temporary-name requirements.
- [ ] Reuse of the old name for a new object.
- [ ] Collision with an already existing destination.
- [ ] Quoted, mixed-case, Unicode, reserved-word, and 63-byte-boundary names.
- [ ] Two equally plausible candidates and one-to-many/many-to-one ambiguity.
- [ ] Rename across schemas, when that is semantically a rename plus move.

Assertions should check table/type/function OIDs when PostgreSQL preserves them,
column attribute numbers, sequence ownership, constraint/index linkage, owners,
ACLs, comments, security labels, policies, triggers, views, and application
queries. Data rows must survive.

## PostgreSQL transition catalogue

### Schemas, tables, columns, and sequences

- [ ] Create, drop, rename, move, authorize, and change ownership of schemas.
- [ ] Create, drop, rename, move, persist/unpersist, and change ownership of
  tables; cover ordinary, unlogged, temporary-boundary, partitioned, inherited,
  typed, foreign, and identity-bearing tables where in scope.
- [ ] Add, drop, rename, reorder-only, and batch columns on empty and populated
  tables.
- [ ] Change data type with implicit cast, assignment cast, explicit USING,
  lossy conversion, incompatible conversion, arrays, domains, enums, and
  collation changes.
- [ ] Add/change/drop defaults, including volatile defaults and expression
  defaults; verify existing rows are not rewritten incorrectly.
- [ ] Add/drop NOT NULL with and without valid data and with staged validation.
- [ ] Add/change/drop identity and generated expressions; switch identity
  ALWAYS/BY DEFAULT; restart and change sequence options.
- [ ] Change compression, storage, statistics target, column options, and
  per-column privileges.
- [ ] Sequence create/drop/rename/move; type, increment, min/max, cache, cycle,
  restart, owned-by, and ownership changes.
- [ ] Table access method, tablespace, persistence, storage parameters, replica
  identity, row-security flags, clustering, and inheritance changes.
- [ ] Preserve rows containing NULLs, defaults, arrays, JSON, bytea, large text,
  generated values, identity values, and boundary numeric/time values.

### Constraints, indexes, statistics, and rules

- [ ] Primary key, unique, foreign key, check, exclusion, and NOT NULL
  constraint create/drop/rename and property changes.
- [ ] Composite keys; self, cyclic, multi-column, cross-schema, partitioned, and
  deferrable foreign keys; action and match-mode changes.
- [ ] NOT VALID creation followed by VALIDATE CONSTRAINT, including invalid
  existing data.
- [ ] Attach an existing unique index as a constraint and detach or replace it
  without needless rebuilds.
- [ ] Index create/drop/rename/move and changes to uniqueness, method, columns,
  expressions, sort order, NULLS order, INCLUDE, predicate, collation, operator
  class, options, tablespace, and validity.
- [ ] Partial, expression, covering, multicolumn, partitioned, hash, GiST, SP-GiST,
  GIN, BRIN, and extension-provided indexes.
- [ ] Concurrent-index policy, invalid indexes, clustered indexes, replica
  identity indexes, and duplicate-equivalent definitions.
- [ ] Extended statistics create/drop/rename and changes to columns, kinds,
  target, owner, and schema.
- [ ] Rewrite rules create/replace/drop/enable/disable and interaction with
  views, triggers, and RLS.

### Partitions and inheritance

- [ ] RANGE, LIST, HASH, DEFAULT, multilevel, and subpartitioned hierarchies.
- [ ] Add, detach, finalize detach, attach, rename, move, and drop partitions.
- [ ] Change bounds, default-partition constraints, partition keys, and strategy
  through safe staged operations or explicit refusal.
- [ ] Attach populated tables with validated constraints and reject overlapping
  or invalid data.
- [ ] Local versus partitioned indexes, attached indexes, constraints,
  sequences, triggers, RLS, publications, and foreign keys.
- [ ] Traditional inheritance add/drop parent, multiple inheritance, NO INHERIT,
  and inherited column/constraint behavior.

### Types, domains, ranges, and casts

- [ ] Enum create/drop/rename/move; add value before/after, rename value,
  reorder request, delete request, and transactional/version limitations.
- [ ] Domain base type, default, NOT NULL, collation, and named check-constraint
  transitions with populated dependent columns.
- [ ] Composite type attributes add/drop/rename/type/collation changes and
  dependent tables/functions.
- [ ] Range and multirange creation, rename, move, subtype/opclass/canonical/
  diff changes, and dependencies.
- [ ] Base and shell types, input/output/receive/send/analyze/subscript
  functions, storage/alignment/category/preference/collatability changes.
- [ ] Cast create/drop and changes to function, context, and method.
- [ ] Operator, operator class, operator family, aggregate, and support-function
  dependency transitions.
- [ ] Positive CREATE TRANSFORM coverage plus replace/drop and language/type
  dependencies.

### Views and materialized views

- [ ] Create/replace/drop/rename/move and ownership, comment, ACL, security
  barrier/invoker, check option, and column-name changes.
- [ ] Compatible and incompatible output-column changes; nested, recursive,
  lateral, aggregate, window, set-operation, and cross-schema views.
- [ ] Dependency-safe ordering when base objects and view chains change
  together.
- [ ] Materialized-view query, options, tablespace, access method, index, owner,
  populated/unpopulated state, refresh, and concurrent-refresh eligibility.

### Functions, procedures, aggregates, and triggers

- [ ] SQL, PL/pgSQL, and supported extension-language routines.
- [ ] Create/replace/drop/rename/move; signature, argument name/mode/default,
  return type/table, language, body, volatility, strictness, leakproofness,
  parallel safety, security mode, support function, cost, rows, configuration,
  owner, ACL, and dependency changes.
- [ ] Overloads, variadic/polymorphic arguments, quoted bodies, dollar-tag
  variants, comments, whitespace, and CRLF-versus-LF normalization.
- [ ] Procedure transaction behavior and IN/OUT signature transitions.
- [ ] Ordinary, ordered-set, and hypothetical-set aggregate transitions,
  including state/combine/serial/deserial/final/moving functions.
- [ ] Row, statement, constraint, INSTEAD OF, transition-table, deferred,
  partitioned-table, enabled/disabled, and replica/always triggers.
- [ ] Event-trigger create/drop/rename/enable changes for ddl_command_start,
  ddl_command_end, table_rewrite, and sql_drop, with tag filtering.
- [ ] Safe ordering when a routine is used by a default, generated column,
  index, constraint, policy, trigger, view, operator, cast, or publication filter.

### Roles, ownership, grants, and row-level security

- [ ] Role create/drop/rename and LOGIN, SUPERUSER, CREATEDB, CREATEROLE,
  REPLICATION, BYPASSRLS, connection limit, validity, password-redaction, and
  membership/admin/inherit/set option transitions.
- [ ] Object ownership changes and DROP OWNED/REASSIGN OWNED boundaries.
- [ ] GRANT/REVOKE for schemas, tables, columns, sequences, routines, types,
  databases, tablespaces, foreign objects, large objects, and parameters.
- [ ] Grant option, PUBLIC, default privileges, grantor identity, duplicate
  grants, and revoke cascade/restrict.
- [ ] RLS enable/disable/force/no-force; policy create/drop/rename and changes
  to command, permissive/restrictive mode, roles, USING, and WITH CHECK.
- [ ] Policies using auth.uid(), auth.jwt(), security-definer helpers, views,
  joins, custom claims, anonymous/authenticated/service roles, and recursive
  policy hazards.
- [ ] Ensure routine security, search_path, ownership, privileges, and RLS are
  changed in a non-exploitable order.

### Publications and logical replication

- [ ] Publication create/drop/rename/owner, FOR ALL TABLES, selected tables,
  schema membership, column lists, row filters, publish operations, partition
  root, and membership add/drop.
- [ ] Supabase Realtime publication membership and replica-identity
  requirements.
- [ ] Subscription definitions, connection-string redaction, enabled state,
  slot/publication changes, origin, streaming, binary, two-phase, failover,
  refresh, skip, and DROP cleanup when a safe test environment supports them.
- [ ] Slot/origin/runtime replication state is asserted separately from
  declarative DDL.

### Text search, collations, conversions, and languages

- [ ] Text-search parser, template, dictionary, and configuration lifecycle;
  token mappings and dependency ordering.
- [ ] Collation create/drop/rename/move, provider, locale/rules, deterministic
  flag, encoding, version refresh, ICU/libc availability, and OS drift.
- [ ] Conversion create/drop/rename/move/default and source/destination
  encoding/function changes.
- [ ] Procedural-language create/drop/rename/owner/handler/validator/inline
  transitions and trusted/untrusted boundaries.

### Extensions, FDWs, and external boundaries

- [ ] Extension create/drop, version upgrade/downgrade request, schema move,
  cascade policy, relocatable/non-relocatable behavior, and configuration-table
  membership.
- [ ] Extension-owned objects are neither duplicated nor accidentally dropped;
  user modifications and upgrade conflicts produce useful diagnostics.
- [ ] Foreign-data wrapper, server, user mapping, and foreign-table
  create/drop/rename/move plus handler/validator/options/owner/ACL changes.
- [ ] Add/change/drop options with correct SET/ADD/DROP syntax and redact
  passwords, tokens, URLs, and connection strings from reports.
- [ ] IMPORT FOREIGN SCHEMA, unavailable endpoints, changed remote schemas,
  local test servers, and failure recovery.
- [ ] Security labels and providers, including pgsodium availability and
  unsupported-provider diagnostics.

### Explicit PostgreSQL boundaries

These require deliberate supported/unsupported decisions rather than accidental
omission:

- [ ] Access methods, transforms, extended statistics, rules, event triggers,
  subscriptions, large objects, database-level settings, and parameter grants.
- [ ] Database and tablespace creation, which may require connections,
  privileges, and transaction boundaries outside a normal project migration.
- [ ] Temporary/session objects, runtime sequence values, materialized-view
  contents, replication slots, prepared transactions, and statistics, which are
  state rather than portable schema.
- [ ] Cluster-level roles/settings and superuser-only features.
- [ ] Unsupported object kinds fail with a stable, actionable diagnostic and do
  not silently disappear from the declarative export.

## Dependency and destructive-change matrix

- [ ] Drop and recreate chains in both topological directions.
- [ ] Rename or move an object referenced by views, routines, triggers,
  policies, generated expressions, indexes, constraints, casts, operators,
  publications, grants, comments, and labels.
- [ ] Simultaneous parent/child changes, dependency diamonds, overload
  ambiguity, cross-schema name resolution, and search_path changes.
- [ ] Temporary-object naming collisions and partial-application cleanup.
- [ ] CASCADE is never added merely to make a migration pass; every cascaded
  loss is explicit and asserted.
- [ ] Classify operations as non-destructive, potentially destructive,
  destructive, data-dependent, lock-heavy, rewrite-heavy, nontransactional, or
  unsupported.
- [ ] Require opt-in or refusal for table/column/type drops, lossy casts, enum
  replacement, partition rebuilds, constraint invalidation, extension cascade,
  and privilege/security weakening.
- [ ] Detect actual data hazards: nulls before NOT NULL, duplicates before
  UNIQUE, orphans before foreign keys, check violations, cast failures, and
  out-of-range values.

## Supabase coverage

Only database objects belong in pg-delta’s migration output. Supabase
configuration, secrets, deployed code, buckets/files, users, messages, and
other service data need companion tests, but must not be mistaken for
declarative PostgreSQL DDL.

### Managed-schema safety

- [ ] A normal diff does not attempt to own, recreate, or drop Supabase-managed
  schemas and objects in auth, storage, realtime, extensions, vault, pgsodium,
  graphql, net, cron, queues, or other installed services.
- [ ] Supported user-defined hooks, policies, triggers, grants, publication
  memberships, and wrapper objects at managed boundaries are retained.
- [ ] Supabase platform upgrades do not produce spurious application migrations.
- [ ] Extension absence/version mismatch and local-versus-hosted differences
  produce explicit diagnostics.

### Auth

- [ ] RLS policies and helpers using auth.uid(), auth.jwt(), JWT claims, MFA/AAL,
  anonymous users, custom access-token claims, and organization membership.
- [ ] Auth hook functions for custom access tokens, password verification,
  send-email/SMS, and MFA verification, with exact grants and ownership.
- [ ] Triggers referencing auth.users, public profile mirrors, delete/update
  cascades, security-definer search_path hardening, and failure behavior.
- [ ] anon, authenticated, service_role, authenticator, and
  supabase_auth_admin privilege boundaries.
- [ ] User/provider/identity records and Auth configuration are seed/service
  fixtures, never emitted as pg-delta schema migration data.

### Storage

- [ ] Policies on storage.objects and storage.buckets for public/private access,
  ownership, folders, MIME/type/size rules, signed operations, and service roles.
- [ ] Public tables referencing bucket/object identifiers and safe triggers or
  helper functions around Storage.
- [ ] Bucket metadata and sample objects are created through seed/service APIs;
  object bytes and managed Storage tables are not reconstructed by pg-delta.

### Realtime

- [ ] Add/remove tables in supabase_realtime, filtered/column publications,
  replica identity, RLS, and grants.
- [ ] Broadcast and Presence authorization policies on realtime.messages.
- [ ] Trigger-based database broadcasts and changes to topic/payload/helper
  functions.
- [ ] Channel subscriptions and messages are behavioral runtime tests, not DDL.

### Edge Functions and database webhooks

- [ ] pg_net webhook triggers for INSERT/UPDATE/DELETE, conditional triggers,
  payload construction, headers, timeout, retry/error logging, and trigger
  rename/change/drop.
- [ ] Vault-backed endpoint/token lookup and secret-redaction assertions.
- [ ] Local, preview, and production URL/config differences do not create
  unstable schema diffs.
- [ ] Edge Function source, import maps, environment variables, JWT verification,
  deployment, invocation, and versioning are separate deployment/behavior tests.
  pg-delta can generate the database trigger/function, not the Edge Function.

### Vault, Cron, Queues, and background work

- [ ] Vault secret wrapper views/functions, ACL/RLS, secret references, rotation,
  deletion, and ciphertext/plaintext non-disclosure.
- [ ] pg_cron jobs and schedules create/change/unschedule, SQL quoting, targets,
  permissions, extension availability, and secrets; job history is runtime data.
- [ ] Supabase Queues/pgmq queue lifecycle, RLS/grants, archive behavior, and
  wrapper functions; queued messages are runtime data.
- [ ] Cross-feature flows such as Cron to function, Queue to worker, Vault to
  webhook, and trigger to Edge Function.

### Optional Supabase extensions and APIs

- [ ] pgvector types, dimensions, distance operators, HNSW/IVFFlat indexes,
  options, function wrappers, dimension changes, and extension upgrades.
- [ ] PostGIS types, SRIDs, spatial indexes, functions, generated geography,
  topology/raster availability, and extension schema ownership.
- [ ] pg_graphql comments/configuration, exposed functions/views/relationships,
  inflection, and schema-cache behavior.
- [ ] Supabase Wrappers/FDWs for supported providers with option changes,
  credentials in Vault, unavailable remotes, and generated foreign tables.
- [ ] pgcrypto, uuid-ossp, pg_trgm, unaccent, pgsodium, pg_net, and other
  supported extension interactions and upgrade boundaries.
- [ ] PostgREST/Data API exposure through schemas, grants, RLS, views, functions,
  computed relationships, overloaded RPCs, comments, and schema-cache reload.

### Configuration, branching, seeding, and deployment

- [ ] config.toml variants for exposed/extra-search-path schemas, migrations,
  seeds, database major version, ports, Auth providers/hooks, Storage, Realtime,
  API, Functions, and enabled extensions where configurable.
- [ ] Multiple declarative schema files, include/exclude ordering, glob order,
  duplicate definitions, deleted files, parse failures, and configuration drift.
- [ ] Local reset, linked remote diff/push, preview branch, hosted project,
  pull/rebase, migration repair, squash, and out-of-order migration histories.
- [ ] Seed idempotence, reference-data evolution, auth/storage test fixtures, and
  deliberate separation between schema diff and data diff.
- [ ] CLI and pg-delta version upgrades, feature flags, generated-file cleanup,
  interrupted commands, offline behavior, and diagnostics.

## Realistic multi-release projects

Single-object tests isolate failures; compound projects expose ordering and
interaction bugs. Build each example through at least three releases:

- [x] Multi-tenant SaaS: organizations, memberships, invitations, custom JWT
  claims, RLS, and billing roles.
- [x] Commerce: products/variants, money domains, inventory, orders, generated
  totals, payment webhooks, partial indexes, and state-machine constraints.
- [x] Realtime chat: rooms, membership RLS, messages, attachments, Realtime
  publication, and Broadcast/Presence database policies.
- [x] Social/media: profiles, follows, reactions, Storage policies, and a
  notification outbox.
- [x] Booking: resource-scoped exclusion constraints, time zones, recurrence,
  and conflict-safe migrations.
- [x] AI/RAG: documents, chunking pipeline, vector dimensions/indexes,
  hybrid text search, queued-job metadata, and model-version evolution.
- [x] Geospatial: PostGIS entities, spatial indexes, trusted-claim region RLS,
  generated projected geometry, and materialized summaries.
- [x] Background processing: portable queue/schedule wrappers,
  retry/dead-letter tables, advisory locks, and worker outboxes.
- [x] Audit ledger: append-only partitions, security-definer APIs, hash chains,
  restricted roles, event triggers, retention, and archive FDWs.
- [x] Analytics/integration: partitioned events, materialized views, incremental
  aggregates, publications, foreign servers, and schema evolution at scale.
- [x] Modular API: several application schemas, cross-schema views/functions,
  role-specific grants, and API exposure changes.
- [x] Billing wrapper: secret references, a foreign data wrapper, webhook
  ingestion, RLS, and secret-reference rotation.
- [x] Search/catalog: text-search dictionaries/configurations, trigram/vector
  indexes, generated search columns, facets, and collation changes.
- [x] GraphQL-first API: relationships, functions, comments/directives, RLS,
  and API-view evolution.
- [x] Extension lifecycle: application objects remain populated across
  extension schema relocation and new dependent objects.
- [x] Legacy import: mixed-case identifiers, old extensions,
  inherited tables, views, routines, and progressive normalization.
- [x] Staged destructive evolution: generated split columns, dual writes,
  compatibility views, and a non-destructive intermediate release.
- [x] Managed-boundary release: application Auth, Storage, Realtime, Vault, and
  webhook customizations without owning managed objects.

## Cross-cutting execution matrix

Run representative high-risk transitions against:

- [ ] Empty, one-row, NULL-heavy, duplicate, orphaned, invalid, boundary-value,
  Unicode, large-row, and production-scale datasets.
- [ ] Small and large tables, partitioned tables, long dependency chains, and
  schemas with thousands of objects.
- [ ] Concurrent reads/writes, long transactions, lock timeouts, deadlocks,
  statement timeouts, cancellation, network loss, and process interruption.
- [ ] Transactional versus nontransactional DDL and mixed migrations.
- [ ] Restricted migration roles, object owners, service roles, superuser-only
  features, missing grants, and changed search_path.
- [ ] Clean database, benign drift, conflicting drift, partially applied
  migration, failed prior migration, and concurrent generation attempts.
- [ ] Local containers, linked projects, hosted projects, preview branches, and
  fresh/restored databases where safe.
- [ ] Supported PostgreSQL majors, Supabase CLI releases, pg-delta releases,
  extension versions, Linux/macOS/Windows clients, and ICU/libc differences.
- [ ] Paths and identifiers containing spaces, quotes, Unicode, long names, and
  platform-specific line endings.
- [ ] Logs, reports, generated SQL, errors, and snapshots containing fake
  credentials to verify complete secret redaction.

## Verification contract

Every test should assert the dimensions that matter for that transition:

- [ ] **SQL shape:** expected native operation, qualification, quoting, ordering,
  transaction boundary, warnings, and absence of forbidden DROP/recreate forms.
- [ ] **Catalog state:** definitions, dependencies, OIDs/attribute numbers when
  identity matters, owners, ACLs, comments, labels, options, and extension
  membership.
- [ ] **Data state:** row count/content, defaults, generated/identity values,
  sequence ownership/value policy, materialized content policy, and no
  truncation or silent cast loss.
- [ ] **Behavior:** representative queries, writes, constraints, functions,
  triggers, RLS identities, API access, Realtime events, jobs, queues, and
  webhook invocations.
- [ ] **Convergence:** a second diff is empty and reverse/multi-hop behavior
  matches the declared policy.
- [ ] **Determinism and recovery:** repeated runs are stable; failure leaves a
  diagnosable, recoverable state and rerun behavior is defined.

In addition to hand-authored fixtures, add property/metamorphic tests:

- [ ] Export followed by diff is empty.
- [ ] Applying a generated diff makes the next diff empty.
- [ ] Reordering semantically unordered declarations does not change output.
- [ ] Formatting, comments in source SQL, and line endings do not create
  semantic migrations.
- [ ] Safe independent changes commute or produce equivalent final catalogs.
- [ ] A to B to A restores the schema except for explicitly documented
  irreversible/runtime state.
- [ ] Generated identifier quoting round-trips arbitrary valid PostgreSQL names.
- [ ] Fuzzed dependency graphs either converge or fail with a stable actionable
  diagnostic, never with silent omission.

## Scope references

- [Supabase declarative database schemas](https://supabase.com/docs/guides/local-development/declarative-database-schemas)
- [Supabase pg-delta public alpha announcement](https://supabase.com/changelog/44938-public-alpha-declarative-schema-management-with-pg-delta)
- [pg-delta source in pg-toolbelt](https://github.com/supabase/pg-toolbelt/tree/main/packages/pg-delta)
- [PostgreSQL 17 SQL commands](https://www.postgresql.org/docs/17/sql-commands.html)
- [Supabase CLI configuration](https://supabase.com/docs/guides/local-development/cli/config)
- [Supabase database migrations](https://supabase.com/docs/guides/local-development/database-migrations)
- [Supabase database extensions](https://supabase.com/docs/guides/database/extensions)
