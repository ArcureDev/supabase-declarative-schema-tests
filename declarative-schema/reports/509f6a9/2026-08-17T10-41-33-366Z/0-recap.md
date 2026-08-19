# Supabase declarative schema CLI report

- Generated: 2026-08-18T19:28:34.563Z
- Supabase CLI version: `0.0.0-pr.6102`
- Checksum: `509f6a9`
- Primary engine: pg-delta next (`SUPABASE_USE_PG_DELTA_NEXT=true`)
- Fallback: snapshot declarative failures and transition warnings/failures are retried with legacy (`SUPABASE_USE_PG_DELTA_NEXT=false`)
- Cases: 598
- Commands OK: 4412
- Commands with warnings: 10
- Commands failed: 257
- Commands skipped: 183
- Runtime: one shared local PostgreSQL container, reset between projects
- Working copies: `.tmp\run-bCM1EI`

<a id="case-results"></a>

## Case results

| Case | Primary | Legacy | Detail |
| --- | --- | --- | --- |
| `01-basic-table` | **OK** | **NOT RUN** | [`case-1.md`](./case-1.md) |
| `02-enum-type` | **OK** | **NOT RUN** | [`case-2.md`](./case-2.md) |
| `03-domain-type` | **OK** | **NOT RUN** | [`case-3.md`](./case-3.md) |
| `04-sequence` | **OK** | **NOT RUN** | [`case-4.md`](./case-4.md) |
| `05-view` | **OK** | **NOT RUN** | [`case-5.md`](./case-5.md) |
| `06-sql-function` | **OK** | **NOT RUN** | [`case-6.md`](./case-6.md) |
| `07-trigger` | **OK** | **NOT RUN** | [`case-7.md`](./case-7.md) |
| `08-rls-policy` | **OK** | **NOT RUN** | [`case-8.md`](./case-8.md) |
| `09-publication` | **OK** | **NOT RUN** | [`case-9.md`](./case-9.md) |
| `10-text-search-configuration` | **WARNING** | **OK** | [`case-10.md`](./case-10.md) |
| `11-schema` | **OK** | **NOT RUN** | [`case-11.md`](./case-11.md) |
| `12-table-check-constraint` | **OK** | **NOT RUN** | [`case-12.md`](./case-12.md) |
| `13-foreign-key` | **OK** | **NOT RUN** | [`case-13.md`](./case-13.md) |
| `14-expression-index` | **OK** | **NOT RUN** | [`case-14.md`](./case-14.md) |
| `15-partial-index` | **OK** | **NOT RUN** | [`case-15.md`](./case-15.md) |
| `16-materialized-view` | **OK** | **NOT RUN** | [`case-16.md`](./case-16.md) |
| `17-composite-type` | **OK** | **NOT RUN** | [`case-17.md`](./case-17.md) |
| `18-range-type` | **OK** | **NOT RUN** | [`case-18.md`](./case-18.md) |
| `19-sql-procedure` | **OK** | **NOT RUN** | [`case-19.md`](./case-19.md) |
| `20-user-defined-aggregate` | **OK** | **NOT RUN** | [`case-20.md`](./case-20.md) |
| `21-generated-stored-column` | **OK** | **NOT RUN** | [`case-21.md`](./case-21.md) |
| `22-identity-column-options` | **OK** | **NOT RUN** | [`case-22.md`](./case-22.md) |
| `23-unlogged-table` | **OK** | **NOT RUN** | [`case-23.md`](./case-23.md) |
| `24-typed-table` | **OK** | **NOT RUN** | [`case-24.md`](./case-24.md) |
| `25-composite-primary-key` | **OK** | **NOT RUN** | [`case-25.md`](./case-25.md) |
| `26-unique-constraint` | **OK** | **NOT RUN** | [`case-26.md`](./case-26.md) |
| `27-unique-nulls-not-distinct` | **OK** | **NOT RUN** | [`case-27.md`](./case-27.md) |
| `28-exclusion-constraint` | **OK** | **NOT RUN** | [`case-28.md`](./case-28.md) |
| `29-deferrable-unique-constraint` | **OK** | **NOT RUN** | [`case-29.md`](./case-29.md) |
| `30-deferrable-foreign-key` | **OK** | **NOT RUN** | [`case-30.md`](./case-30.md) |
| `31-self-referencing-foreign-key` | **OK** | **NOT RUN** | [`case-31.md`](./case-31.md) |
| `32-multi-column-foreign-key` | **OK** | **NOT RUN** | [`case-32.md`](./case-32.md) |
| `33-column-default-expression` | **OK** | **NOT RUN** | [`case-33.md`](./case-33.md) |
| `34-column-collation` | **OK** | **NOT RUN** | [`case-34.md`](./case-34.md) |
| `35-column-compression-setting` | **OK** | **NOT RUN** | [`case-35.md`](./case-35.md) |
| `36-table-storage-parameters` | **OK** | **NOT RUN** | [`case-36.md`](./case-36.md) |
| `37-table-tablespace` | **OK** | **NOT RUN** | [`case-37.md`](./case-37.md) |
| `38-table-inheritance` | **OK** | **NOT RUN** | [`case-38.md`](./case-38.md) |
| `39-range-partitioned-table` | **OK** | **NOT RUN** | [`case-39.md`](./case-39.md) |
| `40-list-partitioned-table` | **OK** | **NOT RUN** | [`case-40.md`](./case-40.md) |
| `41-hash-partitioned-table` | **OK** | **NOT RUN** | [`case-41.md`](./case-41.md) |
| `42-default-partition` | **OK** | **NOT RUN** | [`case-42.md`](./case-42.md) |
| `43-multi-level-partitioning` | **OK** | **NOT RUN** | [`case-43.md`](./case-43.md) |
| `44-partition-constraint-and-bound` | **OK** | **NOT RUN** | [`case-44.md`](./case-44.md) |
| `45-table-replica-identity` | **OK** | **NOT RUN** | [`case-45.md`](./case-45.md) |
| `46-table-and-column-comments` | **OK** | **NOT RUN** | [`case-46.md`](./case-46.md) |
| `47-alter-table-add-rename-and-drop-column` | **OK** | **NOT RUN** | [`case-47.md`](./case-47.md) |
| `48-alter-table-change-column-type-with-using` | **OK** | **NOT RUN** | [`case-48.md`](./case-48.md) |
| `49-alter-table-set-and-drop-default` | **OK** | **NOT RUN** | [`case-49.md`](./case-49.md) |
| `50-alter-table-set-and-drop-not-null` | **OK** | **NOT RUN** | [`case-50.md`](./case-50.md) |
| `51-btree-index` | **OK** | **NOT RUN** | [`case-51.md`](./case-51.md) |
| `52-unique-index` | **OK** | **NOT RUN** | [`case-52.md`](./case-52.md) |
| `53-multi-column-index` | **OK** | **NOT RUN** | [`case-53.md`](./case-53.md) |
| `54-index-sort-order-and-null-placement` | **OK** | **NOT RUN** | [`case-54.md`](./case-54.md) |
| `55-covering-index-with-include` | **OK** | **NOT RUN** | [`case-55.md`](./case-55.md) |
| `56-hash-index` | **OK** | **NOT RUN** | [`case-56.md`](./case-56.md) |
| `57-gin-index` | **OK** | **NOT RUN** | [`case-57.md`](./case-57.md) |
| `58-gist-index` | **OK** | **NOT RUN** | [`case-58.md`](./case-58.md) |
| `59-brin-index` | **OK** | **NOT RUN** | [`case-59.md`](./case-59.md) |
| `60-sp-gist-index` | **OK** | **NOT RUN** | [`case-60.md`](./case-60.md) |
| `61-index-operator-class` | **OK** | **NOT RUN** | [`case-61.md`](./case-61.md) |
| `62-index-collation` | **OK** | **NOT RUN** | [`case-62.md`](./case-62.md) |
| `63-index-storage-parameters` | **OK** | **NOT RUN** | [`case-63.md`](./case-63.md) |
| `64-index-tablespace` | **OK** | **NOT RUN** | [`case-64.md`](./case-64.md) |
| `65-index-on-partitioned-table` | **OK** | **NOT RUN** | [`case-65.md`](./case-65.md) |
| `66-concurrent-index-final-schema` | **OK** | **NOT RUN** | [`case-66.md`](./case-66.md) |
| `67-renamed-index` | **OK** | **NOT RUN** | [`case-67.md`](./case-67.md) |
| `68-clustered-index-marker` | **OK** | **NOT RUN** | [`case-68.md`](./case-68.md) |
| `69-replica-identity-index` | **OK** | **NOT RUN** | [`case-69.md`](./case-69.md) |
| `70-extension-backed-pg-trgm-index` | **OK** | **NOT RUN** | [`case-70.md`](./case-70.md) |
| `71-view-with-security-invoker` | **OK** | **NOT RUN** | [`case-71.md`](./case-71.md) |
| `72-view-with-security-barrier` | **OK** | **NOT RUN** | [`case-72.md`](./case-72.md) |
| `73-recursive-view` | **OK** | **NOT RUN** | [`case-73.md`](./case-73.md) |
| `74-view-check-option` | **OK** | **NOT RUN** | [`case-74.md`](./case-74.md) |
| `75-materialized-view-with-indexes` | **OK** | **NOT RUN** | [`case-75.md`](./case-75.md) |
| `76-plpgsql-function` | **OK** | **NOT RUN** | [`case-76.md`](./case-76.md) |
| `77-function-returning-table` | **OK** | **NOT RUN** | [`case-77.md`](./case-77.md) |
| `78-function-returning-set` | **OK** | **NOT RUN** | [`case-78.md`](./case-78.md) |
| `79-function-with-default-arguments` | **OK** | **NOT RUN** | [`case-79.md`](./case-79.md) |
| `80-function-with-named-and-out-arguments` | **OK** | **NOT RUN** | [`case-80.md`](./case-80.md) |
| `81-variadic-function` | **OK** | **NOT RUN** | [`case-81.md`](./case-81.md) |
| `82-function-volatility-and-parallel-safety` | **OK** | **NOT RUN** | [`case-82.md`](./case-82.md) |
| `83-security-definer-function-with-fixed-search-path` | **OK** | **NOT RUN** | [`case-83.md`](./case-83.md) |
| `84-function-configuration-parameters` | **OK** | **NOT RUN** | [`case-84.md`](./case-84.md) |
| `85-procedure-with-transaction-safe-body` | **OK** | **NOT RUN** | [`case-85.md`](./case-85.md) |
| `86-before-statement-trigger` | **OK** | **NOT RUN** | [`case-86.md`](./case-86.md) |
| `87-after-row-trigger-with-arguments` | **OK** | **NOT RUN** | [`case-87.md`](./case-87.md) |
| `88-constraint-trigger` | **OK** | **NOT RUN** | [`case-88.md`](./case-88.md) |
| `89-instead-of-view-trigger` | **OK** | **NOT RUN** | [`case-89.md`](./case-89.md) |
| `90-trigger-with-when-condition` | **OK** | **NOT RUN** | [`case-90.md`](./case-90.md) |
| `91-truncate-trigger` | **OK** | **NOT RUN** | [`case-91.md`](./case-91.md) |
| `92-transition-table-trigger` | **OK** | **NOT RUN** | [`case-92.md`](./case-92.md) |
| `93-disabled-trigger` | **OK** | **NOT RUN** | [`case-93.md`](./case-93.md) |
| `94-event-trigger-on-ddl-command-end` | **OK** | **NOT RUN** | [`case-94.md`](./case-94.md) |
| `95-event-trigger-on-sql-drop` | **OK** | **NOT RUN** | [`case-95.md`](./case-95.md) |
| `96-enum-type-with-multiple-labels-and-ordering` | **OK** | **NOT RUN** | [`case-96.md`](./case-96.md) |
| `97-enum-value-added-with-alter-type` | **OK** | **NOT RUN** | [`case-97.md`](./case-97.md) |
| `98-domain-with-default-and-not-null` | **FAILED** | **NOT RUN** | [`case-98.md`](./case-98.md) |
| `99-domain-with-multiple-constraints` | **OK** | **NOT RUN** | [`case-99.md`](./case-99.md) |
| `100-multirange-type` | **FAILED** | **NOT RUN** | [`case-100.md`](./case-100.md) |
| `101-base-type-shell-definition` | **FAILED** | **NOT RUN** | [`case-101.md`](./case-101.md) |
| `102-array-use-of-a-custom-type` | **OK** | **NOT RUN** | [`case-102.md`](./case-102.md) |
| `103-custom-cast` | **WARNING** | **OK** | [`case-103.md`](./case-103.md) |
| `104-custom-operator` | **WARNING** | **OK** | [`case-104.md`](./case-104.md) |
| `105-custom-operator-class` | **FAILED** | **NOT RUN** | [`case-105.md`](./case-105.md) |
| `106-custom-operator-family` | **FAILED** | **NOT RUN** | [`case-106.md`](./case-106.md) |
| `107-user-defined-window-aggregate` | **OK** | **NOT RUN** | [`case-107.md`](./case-107.md) |
| `108-ordered-set-aggregate` | **OK** | **NOT RUN** | [`case-108.md`](./case-108.md) |
| `109-procedural-language-registration` | **OK** | **NOT RUN** | [`case-109.md`](./case-109.md) |
| `110-transform-for-a-procedural-language` | **OK** | **NOT RUN** | [`case-110.md`](./case-110.md) |
| `111-schema-authorization` | **FAILED** | **NOT RUN** | [`case-111.md`](./case-111.md) |
| `112-renamed-schema` | **OK** | **NOT RUN** | [`case-112.md`](./case-112.md) |
| `113-sequence-ownership-by-table-column` | **OK** | **NOT RUN** | [`case-113.md`](./case-113.md) |
| `114-cycling-sequence` | **OK** | **NOT RUN** | [`case-114.md`](./case-114.md) |
| `115-descending-sequence` | **OK** | **NOT RUN** | [`case-115.md`](./case-115.md) |
| `116-sequence-cache-and-bounds` | **OK** | **NOT RUN** | [`case-116.md`](./case-116.md) |
| `117-sequence-data-type` | **OK** | **NOT RUN** | [`case-117.md`](./case-117.md) |
| `118-role-creation` | **OK** | **NOT RUN** | [`case-118.md`](./case-118.md) |
| `119-role-membership` | **OK** | **NOT RUN** | [`case-119.md`](./case-119.md) |
| `120-role-configuration-setting` | **OK** | **NOT RUN** | [`case-120.md`](./case-120.md) |
| `121-table-grants` | **OK** | **NOT RUN** | [`case-121.md`](./case-121.md) |
| `122-column-level-grants` | **OK** | **NOT RUN** | [`case-122.md`](./case-122.md) |
| `123-sequence-grants` | **OK** | **NOT RUN** | [`case-123.md`](./case-123.md) |
| `124-function-execution-grants` | **OK** | **NOT RUN** | [`case-124.md`](./case-124.md) |
| `125-schema-usage-and-create-grants` | **OK** | **NOT RUN** | [`case-125.md`](./case-125.md) |
| `126-default-table-privileges` | **OK** | **NOT RUN** | [`case-126.md`](./case-126.md) |
| `127-default-sequence-privileges` | **OK** | **NOT RUN** | [`case-127.md`](./case-127.md) |
| `128-default-function-privileges` | **OK** | **NOT RUN** | [`case-128.md`](./case-128.md) |
| `129-object-ownership-transfer` | **FAILED** | **NOT RUN** | [`case-129.md`](./case-129.md) |
| `130-security-labels` | **OK** | **NOT RUN** | [`case-130.md`](./case-130.md) |
| `131-rls-enabled-without-policies` | **OK** | **NOT RUN** | [`case-131.md`](./case-131.md) |
| `132-rls-forced` | **OK** | **NOT RUN** | [`case-132.md`](./case-132.md) |
| `133-permissive-select-policy` | **OK** | **NOT RUN** | [`case-133.md`](./case-133.md) |
| `134-restrictive-select-policy` | **OK** | **NOT RUN** | [`case-134.md`](./case-134.md) |
| `135-insert-policy-with-with-check` | **OK** | **NOT RUN** | [`case-135.md`](./case-135.md) |
| `136-update-policy-with-using-and-with-check` | **OK** | **NOT RUN** | [`case-136.md`](./case-136.md) |
| `137-delete-policy` | **OK** | **NOT RUN** | [`case-137.md`](./case-137.md) |
| `138-all-commands-policy` | **OK** | **NOT RUN** | [`case-138.md`](./case-138.md) |
| `139-policy-for-multiple-roles` | **OK** | **NOT RUN** | [`case-139.md`](./case-139.md) |
| `140-policy-using-auth-uid` | **OK** | **NOT RUN** | [`case-140.md`](./case-140.md) |
| `141-policy-using-jwt-claims` | **OK** | **NOT RUN** | [`case-141.md`](./case-141.md) |
| `142-policy-calling-a-security-definer-helper` | **OK** | **NOT RUN** | [`case-142.md`](./case-142.md) |
| `143-policy-on-a-partitioned-table` | **OK** | **NOT RUN** | [`case-143.md`](./case-143.md) |
| `144-policy-rename-and-expression-alteration` | **OK** | **NOT RUN** | [`case-144.md`](./case-144.md) |
| `145-data-api-exposed-custom-schema-grants` | **OK** | **NOT RUN** | [`case-145.md`](./case-145.md) |
| `146-publication-for-all-tables` | **OK** | **NOT RUN** | [`case-146.md`](./case-146.md) |
| `147-publication-for-multiple-tables` | **OK** | **NOT RUN** | [`case-147.md`](./case-147.md) |
| `148-publication-with-insert-only-operations` | **OK** | **NOT RUN** | [`case-148.md`](./case-148.md) |
| `149-publication-with-update-and-delete-operations` | **OK** | **NOT RUN** | [`case-149.md`](./case-149.md) |
| `150-publication-with-truncate-operations` | **OK** | **NOT RUN** | [`case-150.md`](./case-150.md) |
| `151-publication-column-list` | **OK** | **NOT RUN** | [`case-151.md`](./case-151.md) |
| `152-publication-row-filter` | **OK** | **NOT RUN** | [`case-152.md`](./case-152.md) |
| `153-publication-partition-root-option` | **OK** | **NOT RUN** | [`case-153.md`](./case-153.md) |
| `154-publication-add-and-drop-table` | **OK** | **NOT RUN** | [`case-154.md`](./case-154.md) |
| `155-publication-schema-membership` | **OK** | **NOT RUN** | [`case-155.md`](./case-155.md) |
| `156-logical-replication-slot-metadata-boundary` | **OK** | **NOT RUN** | [`case-156.md`](./case-156.md) |
| `157-replica-identity-default` | **OK** | **NOT RUN** | [`case-157.md`](./case-157.md) |
| `158-replica-identity-full` | **OK** | **NOT RUN** | [`case-158.md`](./case-158.md) |
| `159-replica-identity-nothing` | **OK** | **NOT RUN** | [`case-159.md`](./case-159.md) |
| `160-supabase-realtime-publication-membership` | **OK** | **NOT RUN** | [`case-160.md`](./case-160.md) |
| `161-text-search-dictionary` | **WARNING** | **OK** | [`case-161.md`](./case-161.md) |
| `162-text-search-template` | **FAILED** | **NOT RUN** | [`case-162.md`](./case-162.md) |
| `163-text-search-parser` | **FAILED** | **NOT RUN** | [`case-163.md`](./case-163.md) |
| `164-text-search-configuration-mapping-replacement` | **WARNING** | **OK** | [`case-164.md`](./case-164.md) |
| `165-text-search-configuration-mapping-addition` | **WARNING** | **OK** | [`case-165.md`](./case-165.md) |
| `166-text-search-configuration-mapping-drop` | **WARNING** | **OK** | [`case-166.md`](./case-166.md) |
| `167-text-search-configuration-rename` | **WARNING** | **OK** | [`case-167.md`](./case-167.md) |
| `168-icu-collation` | **OK** | **NOT RUN** | [`case-168.md`](./case-168.md) |
| `169-libc-collation` | **OK** | **NOT RUN** | [`case-169.md`](./case-169.md) |
| `170-encoding-conversion` | **OK** | **NOT RUN** | [`case-170.md`](./case-170.md) |
| `171-extension-in-extensions-schema` | **OK** | **NOT RUN** | [`case-171.md`](./case-171.md) |
| `172-extension-version-and-cascade-options` | **OK** | **NOT RUN** | [`case-172.md`](./case-172.md) |
| `173-extension-owned-object-boundary` | **OK** | **NOT RUN** | [`case-173.md`](./case-173.md) |
| `174-foreign-data-wrapper` | **OK** | **NOT RUN** | [`case-174.md`](./case-174.md) |
| `175-foreign-server` | **OK** | **NOT RUN** | [`case-175.md`](./case-175.md) |
| `176-user-mapping` | **OK** | **NOT RUN** | [`case-176.md`](./case-176.md) |
| `177-foreign-table` | **OK** | **NOT RUN** | [`case-177.md`](./case-177.md) |
| `178-supabase-vault-secret-wrapper-objects` | **OK** | **NOT RUN** | [`case-178.md`](./case-178.md) |
| `179-supabase-auth-hook-function-and-grants` | **OK** | **NOT RUN** | [`case-179.md`](./case-179.md) |
| `180-supabase-database-webhook-trigger-using-pg-net` | **OK** | **NOT RUN** | [`case-180.md`](./case-180.md) |
| `181-rename-ambiguity` | **OK** | **NOT RUN** | [`case-181.md`](./case-181.md) |
| `182-populated-column-changes` | **OK** | **NOT RUN** | [`case-182.md`](./case-182.md) |
| `183-destructive-change-warning` | **WARNING** | **FAILED** | [`case-183.md`](./case-183.md) |
| `184-dependency-ordering` | **OK** | **NOT RUN** | [`case-184.md`](./case-184.md) |
| `185-no-op-convergence` | **OK** | **NOT RUN** | [`case-185.md`](./case-185.md) |
| `186-grants-rls-preservation` | **OK** | **NOT RUN** | [`case-186.md`](./case-186.md) |
| `187-deterministic-output` | **OK** | **NOT RUN** | [`case-187.md`](./case-187.md) |
| `188-recovery-after-failure` | **OK** | **NOT RUN** | [`case-188.md`](./case-188.md) |
| `189-schema-table-evolution` | **OK** | **NOT RUN** | [`case-189.md`](./case-189.md) |
| `190-table-persistence` | **OK** | **NOT RUN** | [`case-190.md`](./case-190.md) |
| `191-table-storage-parameters` | **OK** | **NOT RUN** | [`case-191.md`](./case-191.md) |
| `192-populated-batch-columns` | **OK** | **NOT RUN** | [`case-192.md`](./case-192.md) |
| `193-implicit-type-widening` | **OK** | **NOT RUN** | [`case-193.md`](./case-193.md) |
| `194-column-default-evolution` | **OK** | **NOT RUN** | [`case-194.md`](./case-194.md) |
| `195-column-not-null` | **OK** | **NOT RUN** | [`case-195.md`](./case-195.md) |
| `196-identity-generation-mode` | **OK** | **NOT RUN** | [`case-196.md`](./case-196.md) |
| `197-generated-column-addition` | **OK** | **NOT RUN** | [`case-197.md`](./case-197.md) |
| `198-sequence-options` | **OK** | **NOT RUN** | [`case-198.md`](./case-198.md) |
| `199-sequence-ownership` | **OK** | **NOT RUN** | [`case-199.md`](./case-199.md) |
| `200-data-shape-preservation` | **OK** | **NOT RUN** | [`case-200.md`](./case-200.md) |
| `201-constraint-property-evolution` | **OK** | **NOT RUN** | [`case-201.md`](./case-201.md) |
| `202-foreign-key-validation` | **FAILED** | **FAILED** | [`case-202.md`](./case-202.md) |
| `203-index-constraint-linkage` | **FAILED** | **FAILED** | [`case-203.md`](./case-203.md) |
| `204-index-definition-evolution` | **FAILED** | **FAILED** | [`case-204.md`](./case-204.md) |
| `205-advanced-index-markers` | **FAILED** | **FAILED** | [`case-205.md`](./case-205.md) |
| `206-statistics-and-rules` | **OK** | **NOT RUN** | [`case-206.md`](./case-206.md) |
| `207-partition-lifecycle` | **FAILED** | **FAILED** | [`case-207.md`](./case-207.md) |
| `208-partition-attach-and-inheritance` | **FAILED** | **FAILED** | [`case-208.md`](./case-208.md) |
| `209-enum-domain-evolution` | **OK** | **NOT RUN** | [`case-209.md`](./case-209.md) |
| `210-composite-range-evolution` | **OK** | **NOT RUN** | [`case-210.md`](./case-210.md) |
| `211-cast-operator-transform-creation` | **OK** | **NOT RUN** | [`case-211.md`](./case-211.md) |
| `212-view-materialized-view-evolution` | **FAILED** | **FAILED** | [`case-212.md`](./case-212.md) |
| `213-routine-procedure-replacement` | **FAILED** | **FAILED** | [`case-213.md`](./case-213.md) |
| `214-aggregate-definition-evolution` | **OK** | **NOT RUN** | [`case-214.md`](./case-214.md) |
| `215-trigger-definition-evolution` | **OK** | **NOT RUN** | [`case-215.md`](./case-215.md) |
| `216-event-trigger-enable-evolution` | **OK** | **NOT RUN** | [`case-216.md`](./case-216.md) |
| `217-cross-kind-dependency-ordering` | **FAILED** | **FAILED** | [`case-217.md`](./case-217.md) |
| `218-role-membership-acl-hardening` | **OK** | **NOT RUN** | [`case-218.md`](./case-218.md) |
| `219-rls-policy-hardening` | **FAILED** | **FAILED** | [`case-219.md`](./case-219.md) |
| `220-realtime-publication-membership` | **OK** | **NOT RUN** | [`case-220.md`](./case-220.md) |
| `221-text-search-mapping-transition` | **OK** | **NOT RUN** | [`case-221.md`](./case-221.md) |
| `222-collation-conversion-create` | **FAILED** | **FAILED** | [`case-222.md`](./case-222.md) |
| `223-extension-dependent-index` | **OK** | **NOT RUN** | [`case-223.md`](./case-223.md) |
| `224-fdw-option-redaction` | **OK** | **NOT RUN** | [`case-224.md`](./case-224.md) |
| `225-managed-schema-boundary` | **OK** | **NOT RUN** | [`case-225.md`](./case-225.md) |
| `226-auth-uid-policy-hardening` | **FAILED** | **FAILED** | [`case-226.md`](./case-226.md) |
| `227-storage-object-policy-hardening` | **FAILED** | **FAILED** | [`case-227.md`](./case-227.md) |
| `228-realtime-message-policy-hardening` | **FAILED** | **FAILED** | [`case-228.md`](./case-228.md) |
| `229-pg-net-webhook-replacement` | **FAILED** | **FAILED** | [`case-229.md`](./case-229.md) |
| `230-vault-secret-data-boundary` | **FAILED** | **FAILED** | [`case-230.md`](./case-230.md) |
| `231-cron-job-data-boundary` | **OK** | **NOT RUN** | [`case-231.md`](./case-231.md) |
| `232-queue-message-data-boundary` | **OK** | **NOT RUN** | [`case-232.md`](./case-232.md) |
| `233-pgvector-index-addition` | **OK** | **NOT RUN** | [`case-233.md`](./case-233.md) |
| `234-postgis-index-addition` | **FAILED** | **FAILED** | [`case-234.md`](./case-234.md) |
| `235-pg-graphql-acl-exposure` | **FAILED** | **FAILED** | [`case-235.md`](./case-235.md) |
| `236-wrappers-openapi-server-options` | **FAILED** | **FAILED** | [`case-236.md`](./case-236.md) |
| `237-tenant-modular-graphql-release` | **FAILED** | **FAILED** | [`case-237.md`](./case-237.md) |
| `238-commerce-booking-billing-release` | **OK** | **NOT RUN** | [`case-238.md`](./case-238.md) |
| `239-realtime-social-managed-boundaries` | **FAILED** | **FAILED** | [`case-239.md`](./case-239.md) |
| `240-rag-search-extension-release` | **FAILED** | **FAILED** | [`case-240.md`](./case-240.md) |
| `241-geospatial-analytics-integration` | **OK** | **NOT RUN** | [`case-241.md`](./case-241.md) |
| `242-background-processing-release` | **FAILED** | **FAILED** | [`case-242.md`](./case-242.md) |
| `243-audit-ledger-archive-release` | **OK** | **NOT RUN** | [`case-243.md`](./case-243.md) |
| `244-legacy-staged-normalization` | **FAILED** | **FAILED** | [`case-244.md`](./case-244.md) |
| `245-managed-schema-negative-probe` | **FAILED** | **FAILED** | [`case-245.md`](./case-245.md) |
| `246-managed-boundary-retention` | **FAILED** | **FAILED** | [`case-246.md`](./case-246.md) |
| `247-platform-upgrade-config-drift-no-op` | **FAILED** | **NOT RUN** | [`case-247.md`](./case-247.md) |
| `248-extension-absence-version-diagnostic` | **OK** | **NOT RUN** | [`case-248.md`](./case-248.md) |
| `249-jwt-custom-claims-mfa-rls` | **FAILED** | **FAILED** | [`case-249.md`](./case-249.md) |
| `250-anonymous-rls` | **FAILED** | **FAILED** | [`case-250.md`](./case-250.md) |
| `251-auth-hook-suite` | **OK** | **NOT RUN** | [`case-251.md`](./case-251.md) |
| `252-auth-users-trigger-hardening` | **FAILED** | **FAILED** | [`case-252.md`](./case-252.md) |
| `253-supabase-role-boundaries` | **FAILED** | **FAILED** | [`case-253.md`](./case-253.md) |
| `254-auth-data-boundary-local-service` | **OK** | **NOT RUN** | [`case-254.md`](./case-254.md) |
| `255-storage-policy-matrix` | **FAILED** | **FAILED** | [`case-255.md`](./case-255.md) |
| `256-storage-reference-helpers` | **FAILED** | **FAILED** | [`case-256.md`](./case-256.md) |
| `257-storage-api-data-boundary` | **FAILED** | **NOT RUN** | [`case-257.md`](./case-257.md) |
| `258-realtime-publication-removal` | **FAILED** | **FAILED** | [`case-258.md`](./case-258.md) |
| `259-filtered-column-publication` | **FAILED** | **FAILED** | [`case-259.md`](./case-259.md) |
| `260-broadcast-presence-policies` | **FAILED** | **FAILED** | [`case-260.md`](./case-260.md) |
| `261-database-broadcast-helper-evolution` | **FAILED** | **FAILED** | [`case-261.md`](./case-261.md) |
| `262-realtime-subscription-runtime` | **FAILED** | **NOT RUN** | [`case-262.md`](./case-262.md) |
| `263-pg-net-trigger-lifecycle` | **FAILED** | **FAILED** | [`case-263.md`](./case-263.md) |
| `264-vault-backed-webhook-redaction` | **FAILED** | **OK** | [`case-264.md`](./case-264.md) |
| `265-url-config-stability` | **OK** | **NOT RUN** | [`case-265.md`](./case-265.md) |
| `266-edge-function-jwt-verification` | **OK** | **NOT RUN** | [`case-266.md`](./case-266.md) |
| `267-edge-function-version-behavior` | **OK** | **NOT RUN** | [`case-267.md`](./case-267.md) |
| `268-vault-secret-lifecycle` | **OK** | **NOT RUN** | [`case-268.md`](./case-268.md) |
| `269-cron-runtime-diagnostic` | **OK** | **NOT RUN** | [`case-269.md`](./case-269.md) |
| `270-pgmq-queue-lifecycle` | **OK** | **NOT RUN** | [`case-270.md`](./case-270.md) |
| `271-cron-queue-webhook-pipeline` | **OK** | **NOT RUN** | [`case-271.md`](./case-271.md) |
| `272-pgvector-dimension-change-safety` | **OK** | **NOT RUN** | [`case-272.md`](./case-272.md) |
| `273-pgvector-ivfflat-options` | **FAILED** | **FAILED** | [`case-273.md`](./case-273.md) |
| `274-postgis-generated-geography` | **OK** | **NOT RUN** | [`case-274.md`](./case-274.md) |
| `275-postgis-version-availability-diagnostic` | **FAILED** | **FAILED** | [`case-275.md`](./case-275.md) |
| `276-pg-graphql-comments-inflection` | **FAILED** | **FAILED** | [`case-276.md`](./case-276.md) |
| `277-postgrest-schema-cache-behavior` | **FAILED** | **NOT RUN** | [`case-277.md`](./case-277.md) |
| `278-wrappers-vault-credential-redaction` | **FAILED** | **FAILED** | [`case-278.md`](./case-278.md) |
| `279-unavailable-remote-diagnostic` | **OK** | **NOT RUN** | [`case-279.md`](./case-279.md) |
| `280-common-extension-upgrade-boundary` | **OK** | **NOT RUN** | [`case-280.md`](./case-280.md) |
| `281-postgrest-data-api-exposure` | **OK** | **NOT RUN** | [`case-281.md`](./case-281.md) |
| `282-api-schema-exposure-config` | **OK** | **NOT RUN** | [`case-282.md`](./case-282.md) |
| `283-auth-storage-realtime-config` | **FAILED** | **NOT RUN** | [`case-283.md`](./case-283.md) |
| `284-extension-config-availability` | **FAILED** | **NOT RUN** | [`case-284.md`](./case-284.md) |
| `285-multi-file-declarative-ordering` | **FAILED** | **NOT RUN** | [`case-285.md`](./case-285.md) |
| `286-conflicting-definitions-diagnostic` | **OK** | **NOT RUN** | [`case-286.md`](./case-286.md) |
| `287-local-reset-idempotence` | **OK** | **NOT RUN** | [`case-287.md`](./case-287.md) |
| `290-seed-idempotence` | **OK** | **NOT RUN** | [`case-290.md`](./case-290.md) |
| `291-schema-data-boundary` | **FAILED** | **NOT RUN** | [`case-291.md`](./case-291.md) |
| `292-migration-repair-squash` | **OK** | **NOT RUN** | [`case-292.md`](./case-292.md) |
| `293-cli-version-evidence` | **OK** | **NOT RUN** | [`case-293.md`](./case-293.md) |
| `294-pg-delta-feature-flag` | **FAILED** | **NOT RUN** | [`case-294.md`](./case-294.md) |
| `295-interrupted-command-recovery` | **FAILED** | **NOT RUN** | [`case-295.md`](./case-295.md) |
| `296-offline-diagnostics` | **FAILED** | **NOT RUN** | [`case-296.md`](./case-296.md) |
| `297-managed-database-webhook-trigger` | **OK** | **NOT RUN** | [`case-297.md`](./case-297.md) |
| `298-create-schema` | **OK** | **NOT RUN** | [`case-298.md`](./case-298.md) |
| `299-drop-schema` | **OK** | **NOT RUN** | [`case-299.md`](./case-299.md) |
| `300-rename-schema` | **OK** | **NOT RUN** | [`case-300.md`](./case-300.md) |
| `301-move-schema` | **OK** | **NOT RUN** | [`case-301.md`](./case-301.md) |
| `302-authorize-schema` | **OK** | **NOT RUN** | [`case-302.md`](./case-302.md) |
| `303-ownership-schema` | **OK** | **NOT RUN** | [`case-303.md`](./case-303.md) |
| `304-create-table` | **OK** | **NOT RUN** | [`case-304.md`](./case-304.md) |
| `305-drop-table` | **OK** | **NOT RUN** | [`case-305.md`](./case-305.md) |
| `306-rename-table` | **OK** | **NOT RUN** | [`case-306.md`](./case-306.md) |
| `307-move-table` | **OK** | **NOT RUN** | [`case-307.md`](./case-307.md) |
| `308-persist-unlogged` | **OK** | **NOT RUN** | [`case-308.md`](./case-308.md) |
| `309-ownership-table` | **OK** | **NOT RUN** | [`case-309.md`](./case-309.md) |
| `310-kind-partitioned` | **OK** | **NOT RUN** | [`case-310.md`](./case-310.md) |
| `311-kind-inherited` | **FAILED** | **FAILED** | [`case-311.md`](./case-311.md) |
| `312-kind-typed` | **OK** | **NOT RUN** | [`case-312.md`](./case-312.md) |
| `313-kind-foreign` | **OK** | **NOT RUN** | [`case-313.md`](./case-313.md) |
| `314-kind-identity` | **OK** | **NOT RUN** | [`case-314.md`](./case-314.md) |
| `315-boundary-temporary` | **FAILED** | **FAILED** | [`case-315.md`](./case-315.md) |
| `316-add-column-at-empty` | **OK** | **NOT RUN** | [`case-316.md`](./case-316.md) |
| `317-add-column-at-populated` | **OK** | **NOT RUN** | [`case-317.md`](./case-317.md) |
| `318-drop-column-at-empty` | **OK** | **NOT RUN** | [`case-318.md`](./case-318.md) |
| `319-drop-column-at-populated` | **WARNING** | **FAILED** | [`case-319.md`](./case-319.md) |
| `320-rename-column` | **OK** | **NOT RUN** | [`case-320.md`](./case-320.md) |
| `321-reorder-column` | **FAILED** | **FAILED** | [`case-321.md`](./case-321.md) |
| `322-batch-columns-at-empty` | **FAILED** | **FAILED** | [`case-322.md`](./case-322.md) |
| `323-batch-columns-at-populated` | **OK** | **NOT RUN** | [`case-323.md`](./case-323.md) |
| `324-cast-implicit` | **OK** | **NOT RUN** | [`case-324.md`](./case-324.md) |
| `325-cast-assignment` | **OK** | **NOT RUN** | [`case-325.md`](./case-325.md) |
| `326-cast-using` | **OK** | **NOT RUN** | [`case-326.md`](./case-326.md) |
| `327-cast-lossy` | **FAILED** | **FAILED** | [`case-327.md`](./case-327.md) |
| `328-cast-incompatible` | **FAILED** | **FAILED** | [`case-328.md`](./case-328.md) |
| `329-cast-array` | **OK** | **NOT RUN** | [`case-329.md`](./case-329.md) |
| `330-cast-domain` | **OK** | **NOT RUN** | [`case-330.md`](./case-330.md) |
| `331-cast-enum` | **FAILED** | **FAILED** | [`case-331.md`](./case-331.md) |
| `332-cast-collation` | **OK** | **NOT RUN** | [`case-332.md`](./case-332.md) |
| `333-default-add` | **OK** | **NOT RUN** | [`case-333.md`](./case-333.md) |
| `334-default-change` | **OK** | **NOT RUN** | [`case-334.md`](./case-334.md) |
| `335-default-drop` | **OK** | **NOT RUN** | [`case-335.md`](./case-335.md) |
| `336-default-volatile` | **OK** | **NOT RUN** | [`case-336.md`](./case-336.md) |
| `337-default-expression` | **OK** | **NOT RUN** | [`case-337.md`](./case-337.md) |
| `338-default-no-rewrite` | **OK** | **NOT RUN** | [`case-338.md`](./case-338.md) |
| `339-notnull-add-valid` | **OK** | **NOT RUN** | [`case-339.md`](./case-339.md) |
| `340-notnull-add-invalid` | **FAILED** | **FAILED** | [`case-340.md`](./case-340.md) |
| `341-notnull-drop` | **OK** | **NOT RUN** | [`case-341.md`](./case-341.md) |
| `342-notnull-staged` | **FAILED** | **FAILED** | [`case-342.md`](./case-342.md) |
| `343-identity-add` | **OK** | **NOT RUN** | [`case-343.md`](./case-343.md) |
| `344-identity-drop` | **OK** | **NOT RUN** | [`case-344.md`](./case-344.md) |
| `345-identity-always` | **OK** | **NOT RUN** | [`case-345.md`](./case-345.md) |
| `346-identity-by-default` | **OK** | **NOT RUN** | [`case-346.md`](./case-346.md) |
| `347-identity-restart` | **FAILED** | **FAILED** | [`case-347.md`](./case-347.md) |
| `348-generated-add` | **OK** | **NOT RUN** | [`case-348.md`](./case-348.md) |
| `349-generated-change` | **OK** | **NOT RUN** | [`case-349.md`](./case-349.md) |
| `350-generated-drop` | **OK** | **NOT RUN** | [`case-350.md`](./case-350.md) |
| `351-compression` | **FAILED** | **FAILED** | [`case-351.md`](./case-351.md) |
| `352-storage` | **OK** | **NOT RUN** | [`case-352.md`](./case-352.md) |
| `353-statistics-target` | **OK** | **NOT RUN** | [`case-353.md`](./case-353.md) |
| `354-column-options` | **OK** | **NOT RUN** | [`case-354.md`](./case-354.md) |
| `355-column-privileges` | **OK** | **NOT RUN** | [`case-355.md`](./case-355.md) |
| `356-create-sequence` | **OK** | **NOT RUN** | [`case-356.md`](./case-356.md) |
| `357-drop-sequence` | **OK** | **NOT RUN** | [`case-357.md`](./case-357.md) |
| `358-rename-sequence` | **OK** | **NOT RUN** | [`case-358.md`](./case-358.md) |
| `359-move-sequence` | **OK** | **NOT RUN** | [`case-359.md`](./case-359.md) |
| `360-sequence-type` | **OK** | **NOT RUN** | [`case-360.md`](./case-360.md) |
| `361-sequence-increment` | **OK** | **NOT RUN** | [`case-361.md`](./case-361.md) |
| `362-sequence-bounds` | **OK** | **NOT RUN** | [`case-362.md`](./case-362.md) |
| `363-sequence-cache` | **OK** | **NOT RUN** | [`case-363.md`](./case-363.md) |
| `364-sequence-cycle` | **OK** | **NOT RUN** | [`case-364.md`](./case-364.md) |
| `365-sequence-restart` | **FAILED** | **FAILED** | [`case-365.md`](./case-365.md) |
| `366-sequence-owned-by` | **OK** | **NOT RUN** | [`case-366.md`](./case-366.md) |
| `367-sequence-ownership` | **OK** | **NOT RUN** | [`case-367.md`](./case-367.md) |
| `368-access-method` | **FAILED** | **FAILED** | [`case-368.md`](./case-368.md) |
| `369-tablespace` | **FAILED** | **FAILED** | [`case-369.md`](./case-369.md) |
| `370-persistence` | **OK** | **NOT RUN** | [`case-370.md`](./case-370.md) |
| `371-storage-params` | **OK** | **NOT RUN** | [`case-371.md`](./case-371.md) |
| `372-replica-identity` | **OK** | **NOT RUN** | [`case-372.md`](./case-372.md) |
| `373-rls-flags` | **OK** | **NOT RUN** | [`case-373.md`](./case-373.md) |
| `374-clustering` | **OK** | **NOT RUN** | [`case-374.md`](./case-374.md) |
| `375-inheritance` | **OK** | **NOT RUN** | [`case-375.md`](./case-375.md) |
| `376-preserve-null` | **OK** | **NOT RUN** | [`case-376.md`](./case-376.md) |
| `377-preserve-default` | **OK** | **NOT RUN** | [`case-377.md`](./case-377.md) |
| `378-preserve-array` | **OK** | **NOT RUN** | [`case-378.md`](./case-378.md) |
| `379-preserve-json` | **OK** | **NOT RUN** | [`case-379.md`](./case-379.md) |
| `380-preserve-bytea` | **OK** | **NOT RUN** | [`case-380.md`](./case-380.md) |
| `381-preserve-large-text` | **OK** | **NOT RUN** | [`case-381.md`](./case-381.md) |
| `382-preserve-generated` | **OK** | **NOT RUN** | [`case-382.md`](./case-382.md) |
| `383-preserve-identity` | **OK** | **NOT RUN** | [`case-383.md`](./case-383.md) |
| `384-preserve-numeric` | **OK** | **NOT RUN** | [`case-384.md`](./case-384.md) |
| `385-preserve-time` | **OK** | **NOT RUN** | [`case-385.md`](./case-385.md) |
| `386-pk-create` | **OK** | **NOT RUN** | [`case-386.md`](./case-386.md) |
| `387-pk-drop` | **OK** | **NOT RUN** | [`case-387.md`](./case-387.md) |
| `388-unique-create` | **OK** | **NOT RUN** | [`case-388.md`](./case-388.md) |
| `389-fk-create` | **OK** | **NOT RUN** | [`case-389.md`](./case-389.md) |
| `390-check-create` | **OK** | **NOT RUN** | [`case-390.md`](./case-390.md) |
| `391-exclusion-create` | **OK** | **NOT RUN** | [`case-391.md`](./case-391.md) |
| `392-notnull-constraint` | **OK** | **NOT RUN** | [`case-392.md`](./case-392.md) |
| `393-rename-constraint` | **OK** | **NOT RUN** | [`case-393.md`](./case-393.md) |
| `394-fk-composite` | **OK** | **NOT RUN** | [`case-394.md`](./case-394.md) |
| `395-fk-self` | **OK** | **NOT RUN** | [`case-395.md`](./case-395.md) |
| `396-fk-cross-schema` | **OK** | **NOT RUN** | [`case-396.md`](./case-396.md) |
| `397-fk-deferrable` | **OK** | **NOT RUN** | [`case-397.md`](./case-397.md) |
| `398-fk-action` | **OK** | **NOT RUN** | [`case-398.md`](./case-398.md) |
| `399-fk-match` | **OK** | **NOT RUN** | [`case-399.md`](./case-399.md) |
| `400-not-valid-create` | **OK** | **NOT RUN** | [`case-400.md`](./case-400.md) |
| `401-validate-constraint` | **OK** | **NOT RUN** | [`case-401.md`](./case-401.md) |
| `402-validate-invalid` | **FAILED** | **FAILED** | [`case-402.md`](./case-402.md) |
| `403-index-attach-constraint` | **OK** | **NOT RUN** | [`case-403.md`](./case-403.md) |
| `404-index-replace-constraint` | **OK** | **NOT RUN** | [`case-404.md`](./case-404.md) |
| `405-index-create` | **OK** | **NOT RUN** | [`case-405.md`](./case-405.md) |
| `406-index-drop` | **OK** | **NOT RUN** | [`case-406.md`](./case-406.md) |
| `407-index-rename` | **OK** | **NOT RUN** | [`case-407.md`](./case-407.md) |
| `408-index-move` | **OK** | **NOT RUN** | [`case-408.md`](./case-408.md) |
| `409-index-unique` | **OK** | **NOT RUN** | [`case-409.md`](./case-409.md) |
| `410-index-method` | **OK** | **NOT RUN** | [`case-410.md`](./case-410.md) |
| `411-index-expression` | **OK** | **NOT RUN** | [`case-411.md`](./case-411.md) |
| `412-index-include` | **OK** | **NOT RUN** | [`case-412.md`](./case-412.md) |
| `413-index-predicate` | **OK** | **NOT RUN** | [`case-413.md`](./case-413.md) |
| `414-index-sort` | **OK** | **NOT RUN** | [`case-414.md`](./case-414.md) |
| `415-index-partial` | **OK** | **NOT RUN** | [`case-415.md`](./case-415.md) |
| `416-index-covering` | **OK** | **NOT RUN** | [`case-416.md`](./case-416.md) |
| `417-index-multicolumn` | **OK** | **NOT RUN** | [`case-417.md`](./case-417.md) |
| `418-index-hash` | **OK** | **NOT RUN** | [`case-418.md`](./case-418.md) |
| `419-index-gin` | **OK** | **NOT RUN** | [`case-419.md`](./case-419.md) |
| `420-index-gist` | **OK** | **NOT RUN** | [`case-420.md`](./case-420.md) |
| `421-index-brin` | **OK** | **NOT RUN** | [`case-421.md`](./case-421.md) |
| `422-index-extension` | **OK** | **NOT RUN** | [`case-422.md`](./case-422.md) |
| `423-index-concurrent` | **FAILED** | **FAILED** | [`case-423.md`](./case-423.md) |
| `424-index-invalid` | **FAILED** | **FAILED** | [`case-424.md`](./case-424.md) |
| `425-index-clustered` | **OK** | **NOT RUN** | [`case-425.md`](./case-425.md) |
| `426-index-replica-identity` | **OK** | **NOT RUN** | [`case-426.md`](./case-426.md) |
| `427-index-duplicate` | **FAILED** | **FAILED** | [`case-427.md`](./case-427.md) |
| `428-statistics-create` | **FAILED** | **FAILED** | [`case-428.md`](./case-428.md) |
| `429-statistics-drop` | **FAILED** | **FAILED** | [`case-429.md`](./case-429.md) |
| `430-statistics-rename` | **OK** | **NOT RUN** | [`case-430.md`](./case-430.md) |
| `431-rule-create` | **FAILED** | **FAILED** | [`case-431.md`](./case-431.md) |
| `432-rule-replace` | **FAILED** | **FAILED** | [`case-432.md`](./case-432.md) |
| `433-rule-drop` | **FAILED** | **FAILED** | [`case-433.md`](./case-433.md) |
| `434-rule-enable` | **FAILED** | **FAILED** | [`case-434.md`](./case-434.md) |
| `435-partition-range` | **OK** | **NOT RUN** | [`case-435.md`](./case-435.md) |
| `436-partition-list` | **OK** | **NOT RUN** | [`case-436.md`](./case-436.md) |
| `437-partition-hash` | **OK** | **NOT RUN** | [`case-437.md`](./case-437.md) |
| `438-partition-default` | **OK** | **NOT RUN** | [`case-438.md`](./case-438.md) |
| `439-partition-multilevel` | **OK** | **NOT RUN** | [`case-439.md`](./case-439.md) |
| `440-partition-add` | **OK** | **NOT RUN** | [`case-440.md`](./case-440.md) |
| `441-partition-detach` | **OK** | **NOT RUN** | [`case-441.md`](./case-441.md) |
| `442-partition-finalize-detach` | **FAILED** | **FAILED** | [`case-442.md`](./case-442.md) |
| `443-partition-attach` | **OK** | **NOT RUN** | [`case-443.md`](./case-443.md) |
| `444-partition-rename` | **OK** | **NOT RUN** | [`case-444.md`](./case-444.md) |
| `445-partition-move` | **OK** | **NOT RUN** | [`case-445.md`](./case-445.md) |
| `446-partition-drop` | **OK** | **NOT RUN** | [`case-446.md`](./case-446.md) |
| `447-partition-bounds` | **OK** | **NOT RUN** | [`case-447.md`](./case-447.md) |
| `448-partition-key` | **FAILED** | **FAILED** | [`case-448.md`](./case-448.md) |
| `449-partition-strategy` | **FAILED** | **FAILED** | [`case-449.md`](./case-449.md) |
| `450-partition-attach-populated` | **OK** | **NOT RUN** | [`case-450.md`](./case-450.md) |
| `451-partition-attach-invalid` | **FAILED** | **FAILED** | [`case-451.md`](./case-451.md) |
| `452-partition-local-index` | **OK** | **NOT RUN** | [`case-452.md`](./case-452.md) |
| `453-partition-constraint` | **OK** | **NOT RUN** | [`case-453.md`](./case-453.md) |
| `454-partition-trigger` | **OK** | **NOT RUN** | [`case-454.md`](./case-454.md) |
| `455-partition-rls` | **OK** | **NOT RUN** | [`case-455.md`](./case-455.md) |
| `456-partition-fk` | **OK** | **NOT RUN** | [`case-456.md`](./case-456.md) |
| `457-inherit-add` | **OK** | **NOT RUN** | [`case-457.md`](./case-457.md) |
| `458-inherit-drop` | **OK** | **NOT RUN** | [`case-458.md`](./case-458.md) |
| `459-inherit-multiple` | **OK** | **NOT RUN** | [`case-459.md`](./case-459.md) |
| `460-inherit-no-inherit` | **OK** | **NOT RUN** | [`case-460.md`](./case-460.md) |
| `461-enum-create` | **OK** | **NOT RUN** | [`case-461.md`](./case-461.md) |
| `462-enum-drop` | **OK** | **NOT RUN** | [`case-462.md`](./case-462.md) |
| `463-enum-rename` | **OK** | **NOT RUN** | [`case-463.md`](./case-463.md) |
| `464-enum-add-value` | **OK** | **NOT RUN** | [`case-464.md`](./case-464.md) |
| `465-enum-rename-value` | **OK** | **NOT RUN** | [`case-465.md`](./case-465.md) |
| `466-enum-delete-value` | **FAILED** | **FAILED** | [`case-466.md`](./case-466.md) |
| `467-enum-reorder` | **FAILED** | **FAILED** | [`case-467.md`](./case-467.md) |
| `468-domain-default` | **OK** | **NOT RUN** | [`case-468.md`](./case-468.md) |
| `469-domain-not-null` | **OK** | **NOT RUN** | [`case-469.md`](./case-469.md) |
| `470-domain-check` | **OK** | **NOT RUN** | [`case-470.md`](./case-470.md) |
| `471-domain-collation` | **OK** | **NOT RUN** | [`case-471.md`](./case-471.md) |
| `472-composite-add-attribute` | **OK** | **NOT RUN** | [`case-472.md`](./case-472.md) |
| `473-composite-drop-attribute` | **OK** | **NOT RUN** | [`case-473.md`](./case-473.md) |
| `474-composite-rename-attribute` | **OK** | **NOT RUN** | [`case-474.md`](./case-474.md) |
| `475-range-create` | **OK** | **NOT RUN** | [`case-475.md`](./case-475.md) |
| `476-range-rename` | **OK** | **NOT RUN** | [`case-476.md`](./case-476.md) |
| `477-multirange-create` | **OK** | **NOT RUN** | [`case-477.md`](./case-477.md) |
| `478-base-type-create` | **FAILED** | **FAILED** | [`case-478.md`](./case-478.md) |
| `479-shell-type-create` | **FAILED** | **FAILED** | [`case-479.md`](./case-479.md) |
| `480-cast-create` | **FAILED** | **FAILED** | [`case-480.md`](./case-480.md) |
| `481-cast-drop` | **FAILED** | **FAILED** | [`case-481.md`](./case-481.md) |
| `482-operator-create` | **FAILED** | **FAILED** | [`case-482.md`](./case-482.md) |
| `483-opclass-create` | **FAILED** | **FAILED** | [`case-483.md`](./case-483.md) |
| `484-aggregate-dependency` | **OK** | **NOT RUN** | [`case-484.md`](./case-484.md) |
| `485-transform-create` | **FAILED** | **FAILED** | [`case-485.md`](./case-485.md) |
| `486-transform-drop` | **FAILED** | **FAILED** | [`case-486.md`](./case-486.md) |
| `487-view-create` | **OK** | **NOT RUN** | [`case-487.md`](./case-487.md) |
| `488-view-replace` | **OK** | **NOT RUN** | [`case-488.md`](./case-488.md) |
| `489-view-drop` | **OK** | **NOT RUN** | [`case-489.md`](./case-489.md) |
| `490-view-rename` | **OK** | **NOT RUN** | [`case-490.md`](./case-490.md) |
| `491-view-security-invoker` | **OK** | **NOT RUN** | [`case-491.md`](./case-491.md) |
| `492-view-check-option` | **OK** | **NOT RUN** | [`case-492.md`](./case-492.md) |
| `493-view-compatible` | **OK** | **NOT RUN** | [`case-493.md`](./case-493.md) |
| `494-view-incompatible` | **FAILED** | **FAILED** | [`case-494.md`](./case-494.md) |
| `495-view-recursive` | **OK** | **NOT RUN** | [`case-495.md`](./case-495.md) |
| `496-view-cross-schema` | **OK** | **NOT RUN** | [`case-496.md`](./case-496.md) |
| `497-view-dependency-order` | **OK** | **NOT RUN** | [`case-497.md`](./case-497.md) |
| `498-matview-create` | **OK** | **NOT RUN** | [`case-498.md`](./case-498.md) |
| `499-matview-replace` | **OK** | **NOT RUN** | [`case-499.md`](./case-499.md) |
| `500-matview-refresh` | **FAILED** | **FAILED** | [`case-500.md`](./case-500.md) |
| `501-matview-concurrent-refresh` | **FAILED** | **FAILED** | [`case-501.md`](./case-501.md) |
| `502-routine-sql` | **OK** | **NOT RUN** | [`case-502.md`](./case-502.md) |
| `503-routine-plpgsql` | **OK** | **NOT RUN** | [`case-503.md`](./case-503.md) |
| `504-routine-extension-language` | **FAILED** | **FAILED** | [`case-504.md`](./case-504.md) |
| `505-routine-replace` | **OK** | **NOT RUN** | [`case-505.md`](./case-505.md) |
| `506-routine-drop` | **OK** | **NOT RUN** | [`case-506.md`](./case-506.md) |
| `507-routine-rename` | **OK** | **NOT RUN** | [`case-507.md`](./case-507.md) |
| `508-routine-volatility` | **OK** | **NOT RUN** | [`case-508.md`](./case-508.md) |
| `509-routine-security` | **OK** | **NOT RUN** | [`case-509.md`](./case-509.md) |
| `510-routine-parallel` | **OK** | **NOT RUN** | [`case-510.md`](./case-510.md) |
| `511-routine-overload` | **OK** | **NOT RUN** | [`case-511.md`](./case-511.md) |
| `512-routine-variadic` | **OK** | **NOT RUN** | [`case-512.md`](./case-512.md) |
| `513-routine-normalization` | **OK** | **NOT RUN** | [`case-513.md`](./case-513.md) |
| `514-procedure-replace` | **OK** | **NOT RUN** | [`case-514.md`](./case-514.md) |
| `515-procedure-signature` | **OK** | **NOT RUN** | [`case-515.md`](./case-515.md) |
| `516-aggregate-ordinary` | **OK** | **NOT RUN** | [`case-516.md`](./case-516.md) |
| `517-aggregate-ordered-set` | **OK** | **NOT RUN** | [`case-517.md`](./case-517.md) |
| `518-trigger-row` | **OK** | **NOT RUN** | [`case-518.md`](./case-518.md) |
| `519-trigger-statement` | **OK** | **NOT RUN** | [`case-519.md`](./case-519.md) |
| `520-trigger-instead-of` | **OK** | **NOT RUN** | [`case-520.md`](./case-520.md) |
| `521-trigger-disable` | **OK** | **NOT RUN** | [`case-521.md`](./case-521.md) |
| `522-trigger-constraint` | **OK** | **NOT RUN** | [`case-522.md`](./case-522.md) |
| `523-event-trigger-create` | **OK** | **NOT RUN** | [`case-523.md`](./case-523.md) |
| `524-event-trigger-enable` | **OK** | **NOT RUN** | [`case-524.md`](./case-524.md) |
| `525-event-trigger-rename` | **OK** | **NOT RUN** | [`case-525.md`](./case-525.md) |
| `526-event-trigger-tag-filter` | **OK** | **NOT RUN** | [`case-526.md`](./case-526.md) |
| `527-routine-used-by-default` | **OK** | **NOT RUN** | [`case-527.md`](./case-527.md) |
| `528-routine-used-by-view` | **OK** | **NOT RUN** | [`case-528.md`](./case-528.md) |
| `529-role-create` | **FAILED** | **FAILED** | [`case-529.md`](./case-529.md) |
| `530-role-drop` | **FAILED** | **FAILED** | [`case-530.md`](./case-530.md) |
| `531-role-rename` | **OK** | **NOT RUN** | [`case-531.md`](./case-531.md) |
| `532-role-membership` | **FAILED** | **FAILED** | [`case-532.md`](./case-532.md) |
| `533-role-password-redaction` | **FAILED** | **FAILED** | [`case-533.md`](./case-533.md) |
| `534-ownership-object` | **OK** | **NOT RUN** | [`case-534.md`](./case-534.md) |
| `535-ownership-reassign` | **FAILED** | **FAILED** | [`case-535.md`](./case-535.md) |
| `536-grant-table` | **OK** | **NOT RUN** | [`case-536.md`](./case-536.md) |
| `537-grant-schema` | **OK** | **NOT RUN** | [`case-537.md`](./case-537.md) |
| `538-grant-routine` | **OK** | **NOT RUN** | [`case-538.md`](./case-538.md) |
| `539-grant-database` | **FAILED** | **FAILED** | [`case-539.md`](./case-539.md) |
| `540-grant-parameter` | **FAILED** | **FAILED** | [`case-540.md`](./case-540.md) |
| `541-grant-option` | **OK** | **NOT RUN** | [`case-541.md`](./case-541.md) |
| `542-grant-public` | **OK** | **NOT RUN** | [`case-542.md`](./case-542.md) |
| `543-grant-default-privileges` | **OK** | **NOT RUN** | [`case-543.md`](./case-543.md) |
| `544-revoke-cascade` | **FAILED** | **FAILED** | [`case-544.md`](./case-544.md) |
| `545-rls-enable` | **OK** | **NOT RUN** | [`case-545.md`](./case-545.md) |
| `546-rls-force` | **OK** | **NOT RUN** | [`case-546.md`](./case-546.md) |
| `547-policy-create` | **OK** | **NOT RUN** | [`case-547.md`](./case-547.md) |
| `548-policy-drop` | **OK** | **NOT RUN** | [`case-548.md`](./case-548.md) |
| `549-policy-rename` | **OK** | **NOT RUN** | [`case-549.md`](./case-549.md) |
| `550-policy-restrictive` | **OK** | **NOT RUN** | [`case-550.md`](./case-550.md) |
| `551-policy-auth-uid` | **OK** | **NOT RUN** | [`case-551.md`](./case-551.md) |
| `552-policy-auth-jwt` | **OK** | **NOT RUN** | [`case-552.md`](./case-552.md) |
| `553-policy-helper` | **OK** | **NOT RUN** | [`case-553.md`](./case-553.md) |
| `554-security-order` | **OK** | **NOT RUN** | [`case-554.md`](./case-554.md) |
| `555-publication-create` | **OK** | **NOT RUN** | [`case-555.md`](./case-555.md) |
| `556-publication-drop` | **OK** | **NOT RUN** | [`case-556.md`](./case-556.md) |
| `557-publication-rename` | **OK** | **NOT RUN** | [`case-557.md`](./case-557.md) |
| `558-publication-membership` | **OK** | **NOT RUN** | [`case-558.md`](./case-558.md) |
| `559-publication-row-filter` | **OK** | **NOT RUN** | [`case-559.md`](./case-559.md) |
| `560-realtime-membership` | **OK** | **NOT RUN** | [`case-560.md`](./case-560.md) |
| `561-realtime-replica-identity` | **OK** | **NOT RUN** | [`case-561.md`](./case-561.md) |
| `562-subscription-create` | **FAILED** | **FAILED** | [`case-562.md`](./case-562.md) |
| `563-subscription-redaction` | **FAILED** | **FAILED** | [`case-563.md`](./case-563.md) |
| `564-textsearch-config-create` | **OK** | **NOT RUN** | [`case-564.md`](./case-564.md) |
| `565-textsearch-mapping` | **FAILED** | **FAILED** | [`case-565.md`](./case-565.md) |
| `566-collation-create` | **OK** | **NOT RUN** | [`case-566.md`](./case-566.md) |
| `567-collation-drop` | **OK** | **NOT RUN** | [`case-567.md`](./case-567.md) |
| `568-collation-rename` | **OK** | **NOT RUN** | [`case-568.md`](./case-568.md) |
| `569-collation-version` | **FAILED** | **FAILED** | [`case-569.md`](./case-569.md) |
| `570-conversion-create` | **OK** | **NOT RUN** | [`case-570.md`](./case-570.md) |
| `571-conversion-drop` | **OK** | **NOT RUN** | [`case-571.md`](./case-571.md) |
| `572-conversion-rename` | **OK** | **NOT RUN** | [`case-572.md`](./case-572.md) |
| `573-language-create` | **FAILED** | **FAILED** | [`case-573.md`](./case-573.md) |
| `574-language-trusted` | **FAILED** | **FAILED** | [`case-574.md`](./case-574.md) |
| `575-extension-create` | **OK** | **NOT RUN** | [`case-575.md`](./case-575.md) |
| `576-extension-drop` | **FAILED** | **FAILED** | [`case-576.md`](./case-576.md) |
| `577-extension-upgrade` | **FAILED** | **FAILED** | [`case-577.md`](./case-577.md) |
| `578-extension-schema-move` | **OK** | **NOT RUN** | [`case-578.md`](./case-578.md) |
| `579-extension-owned-objects` | **OK** | **NOT RUN** | [`case-579.md`](./case-579.md) |
| `580-extension-conflict` | **FAILED** | **FAILED** | [`case-580.md`](./case-580.md) |
| `581-fdw-create` | **OK** | **NOT RUN** | [`case-581.md`](./case-581.md) |
| `582-server-create` | **OK** | **NOT RUN** | [`case-582.md`](./case-582.md) |
| `583-foreign-table-create` | **OK** | **NOT RUN** | [`case-583.md`](./case-583.md) |
| `584-server-rename` | **OK** | **NOT RUN** | [`case-584.md`](./case-584.md) |
| `585-fdw-options` | **OK** | **NOT RUN** | [`case-585.md`](./case-585.md) |
| `586-fdw-redaction` | **OK** | **NOT RUN** | [`case-586.md`](./case-586.md) |
| `587-fdw-import-schema` | **FAILED** | **FAILED** | [`case-587.md`](./case-587.md) |
| `588-seclabel-create` | **FAILED** | **FAILED** | [`case-588.md`](./case-588.md) |
| `589-seclabel-provider` | **FAILED** | **FAILED** | [`case-589.md`](./case-589.md) |
| `590-boundary-access-method` | **FAILED** | **FAILED** | [`case-590.md`](./case-590.md) |
| `591-boundary-large-object` | **FAILED** | **FAILED** | [`case-591.md`](./case-591.md) |
| `592-boundary-database-settings` | **FAILED** | **FAILED** | [`case-592.md`](./case-592.md) |
| `593-boundary-database-create` | **FAILED** | **FAILED** | [`case-593.md`](./case-593.md) |
| `594-boundary-tablespace-create` | **FAILED** | **FAILED** | [`case-594.md`](./case-594.md) |
| `595-boundary-temp-objects` | **FAILED** | **FAILED** | [`case-595.md`](./case-595.md) |
| `596-boundary-sequence-value` | **FAILED** | **FAILED** | [`case-596.md`](./case-596.md) |
| `597-boundary-prepared-xact` | **FAILED** | **FAILED** | [`case-597.md`](./case-597.md) |
| `598-boundary-cluster-role` | **FAILED** | **FAILED** | [`case-598.md`](./case-598.md) |
| `599-boundary-superuser` | **FAILED** | **FAILED** | [`case-599.md`](./case-599.md) |
| `600-boundary-stable-diagnostic` | **FAILED** | **FAILED** | [`case-600.md`](./case-600.md) |

<!-- declarative-schema-case-result name="01-basic-table" status="OK" -->
<!-- declarative-schema-case-result name="02-enum-type" status="OK" -->
<!-- declarative-schema-case-result name="03-domain-type" status="OK" -->
<!-- declarative-schema-case-result name="04-sequence" status="OK" -->
<!-- declarative-schema-case-result name="05-view" status="OK" -->
<!-- declarative-schema-case-result name="06-sql-function" status="OK" -->
<!-- declarative-schema-case-result name="07-trigger" status="OK" -->
<!-- declarative-schema-case-result name="08-rls-policy" status="OK" -->
<!-- declarative-schema-case-result name="09-publication" status="OK" -->
<!-- declarative-schema-case-result name="10-text-search-configuration" status="WARNING" -->
<!-- declarative-schema-case-result name="11-schema" status="OK" -->
<!-- declarative-schema-case-result name="12-table-check-constraint" status="OK" -->
<!-- declarative-schema-case-result name="13-foreign-key" status="OK" -->
<!-- declarative-schema-case-result name="14-expression-index" status="OK" -->
<!-- declarative-schema-case-result name="15-partial-index" status="OK" -->
<!-- declarative-schema-case-result name="16-materialized-view" status="OK" -->
<!-- declarative-schema-case-result name="17-composite-type" status="OK" -->
<!-- declarative-schema-case-result name="18-range-type" status="OK" -->
<!-- declarative-schema-case-result name="19-sql-procedure" status="OK" -->
<!-- declarative-schema-case-result name="20-user-defined-aggregate" status="OK" -->
<!-- declarative-schema-case-result name="21-generated-stored-column" status="OK" -->
<!-- declarative-schema-case-result name="22-identity-column-options" status="OK" -->
<!-- declarative-schema-case-result name="23-unlogged-table" status="OK" -->
<!-- declarative-schema-case-result name="24-typed-table" status="OK" -->
<!-- declarative-schema-case-result name="25-composite-primary-key" status="OK" -->
<!-- declarative-schema-case-result name="26-unique-constraint" status="OK" -->
<!-- declarative-schema-case-result name="27-unique-nulls-not-distinct" status="OK" -->
<!-- declarative-schema-case-result name="28-exclusion-constraint" status="OK" -->
<!-- declarative-schema-case-result name="29-deferrable-unique-constraint" status="OK" -->
<!-- declarative-schema-case-result name="30-deferrable-foreign-key" status="OK" -->
<!-- declarative-schema-case-result name="31-self-referencing-foreign-key" status="OK" -->
<!-- declarative-schema-case-result name="32-multi-column-foreign-key" status="OK" -->
<!-- declarative-schema-case-result name="33-column-default-expression" status="OK" -->
<!-- declarative-schema-case-result name="34-column-collation" status="OK" -->
<!-- declarative-schema-case-result name="35-column-compression-setting" status="OK" -->
<!-- declarative-schema-case-result name="36-table-storage-parameters" status="OK" -->
<!-- declarative-schema-case-result name="37-table-tablespace" status="OK" -->
<!-- declarative-schema-case-result name="38-table-inheritance" status="OK" -->
<!-- declarative-schema-case-result name="39-range-partitioned-table" status="OK" -->
<!-- declarative-schema-case-result name="40-list-partitioned-table" status="OK" -->
<!-- declarative-schema-case-result name="41-hash-partitioned-table" status="OK" -->
<!-- declarative-schema-case-result name="42-default-partition" status="OK" -->
<!-- declarative-schema-case-result name="43-multi-level-partitioning" status="OK" -->
<!-- declarative-schema-case-result name="44-partition-constraint-and-bound" status="OK" -->
<!-- declarative-schema-case-result name="45-table-replica-identity" status="OK" -->
<!-- declarative-schema-case-result name="46-table-and-column-comments" status="OK" -->
<!-- declarative-schema-case-result name="47-alter-table-add-rename-and-drop-column" status="OK" -->
<!-- declarative-schema-case-result name="48-alter-table-change-column-type-with-using" status="OK" -->
<!-- declarative-schema-case-result name="49-alter-table-set-and-drop-default" status="OK" -->
<!-- declarative-schema-case-result name="50-alter-table-set-and-drop-not-null" status="OK" -->
<!-- declarative-schema-case-result name="51-btree-index" status="OK" -->
<!-- declarative-schema-case-result name="52-unique-index" status="OK" -->
<!-- declarative-schema-case-result name="53-multi-column-index" status="OK" -->
<!-- declarative-schema-case-result name="54-index-sort-order-and-null-placement" status="OK" -->
<!-- declarative-schema-case-result name="55-covering-index-with-include" status="OK" -->
<!-- declarative-schema-case-result name="56-hash-index" status="OK" -->
<!-- declarative-schema-case-result name="57-gin-index" status="OK" -->
<!-- declarative-schema-case-result name="58-gist-index" status="OK" -->
<!-- declarative-schema-case-result name="59-brin-index" status="OK" -->
<!-- declarative-schema-case-result name="60-sp-gist-index" status="OK" -->
<!-- declarative-schema-case-result name="61-index-operator-class" status="OK" -->
<!-- declarative-schema-case-result name="62-index-collation" status="OK" -->
<!-- declarative-schema-case-result name="63-index-storage-parameters" status="OK" -->
<!-- declarative-schema-case-result name="64-index-tablespace" status="OK" -->
<!-- declarative-schema-case-result name="65-index-on-partitioned-table" status="OK" -->
<!-- declarative-schema-case-result name="66-concurrent-index-final-schema" status="OK" -->
<!-- declarative-schema-case-result name="67-renamed-index" status="OK" -->
<!-- declarative-schema-case-result name="68-clustered-index-marker" status="OK" -->
<!-- declarative-schema-case-result name="69-replica-identity-index" status="OK" -->
<!-- declarative-schema-case-result name="70-extension-backed-pg-trgm-index" status="OK" -->
<!-- declarative-schema-case-result name="71-view-with-security-invoker" status="OK" -->
<!-- declarative-schema-case-result name="72-view-with-security-barrier" status="OK" -->
<!-- declarative-schema-case-result name="73-recursive-view" status="OK" -->
<!-- declarative-schema-case-result name="74-view-check-option" status="OK" -->
<!-- declarative-schema-case-result name="75-materialized-view-with-indexes" status="OK" -->
<!-- declarative-schema-case-result name="76-plpgsql-function" status="OK" -->
<!-- declarative-schema-case-result name="77-function-returning-table" status="OK" -->
<!-- declarative-schema-case-result name="78-function-returning-set" status="OK" -->
<!-- declarative-schema-case-result name="79-function-with-default-arguments" status="OK" -->
<!-- declarative-schema-case-result name="80-function-with-named-and-out-arguments" status="OK" -->
<!-- declarative-schema-case-result name="81-variadic-function" status="OK" -->
<!-- declarative-schema-case-result name="82-function-volatility-and-parallel-safety" status="OK" -->
<!-- declarative-schema-case-result name="83-security-definer-function-with-fixed-search-path" status="OK" -->
<!-- declarative-schema-case-result name="84-function-configuration-parameters" status="OK" -->
<!-- declarative-schema-case-result name="85-procedure-with-transaction-safe-body" status="OK" -->
<!-- declarative-schema-case-result name="86-before-statement-trigger" status="OK" -->
<!-- declarative-schema-case-result name="87-after-row-trigger-with-arguments" status="OK" -->
<!-- declarative-schema-case-result name="88-constraint-trigger" status="OK" -->
<!-- declarative-schema-case-result name="89-instead-of-view-trigger" status="OK" -->
<!-- declarative-schema-case-result name="90-trigger-with-when-condition" status="OK" -->
<!-- declarative-schema-case-result name="91-truncate-trigger" status="OK" -->
<!-- declarative-schema-case-result name="92-transition-table-trigger" status="OK" -->
<!-- declarative-schema-case-result name="93-disabled-trigger" status="OK" -->
<!-- declarative-schema-case-result name="94-event-trigger-on-ddl-command-end" status="OK" -->
<!-- declarative-schema-case-result name="95-event-trigger-on-sql-drop" status="OK" -->
<!-- declarative-schema-case-result name="96-enum-type-with-multiple-labels-and-ordering" status="OK" -->
<!-- declarative-schema-case-result name="97-enum-value-added-with-alter-type" status="OK" -->
<!-- declarative-schema-case-result name="98-domain-with-default-and-not-null" status="FAILED" -->
<!-- declarative-schema-case-result name="99-domain-with-multiple-constraints" status="OK" -->
<!-- declarative-schema-case-result name="100-multirange-type" status="FAILED" -->
<!-- declarative-schema-case-result name="101-base-type-shell-definition" status="FAILED" -->
<!-- declarative-schema-case-result name="102-array-use-of-a-custom-type" status="OK" -->
<!-- declarative-schema-case-result name="103-custom-cast" status="WARNING" -->
<!-- declarative-schema-case-result name="104-custom-operator" status="WARNING" -->
<!-- declarative-schema-case-result name="105-custom-operator-class" status="FAILED" -->
<!-- declarative-schema-case-result name="106-custom-operator-family" status="FAILED" -->
<!-- declarative-schema-case-result name="107-user-defined-window-aggregate" status="OK" -->
<!-- declarative-schema-case-result name="108-ordered-set-aggregate" status="OK" -->
<!-- declarative-schema-case-result name="109-procedural-language-registration" status="OK" -->
<!-- declarative-schema-case-result name="110-transform-for-a-procedural-language" status="OK" -->
<!-- declarative-schema-case-result name="111-schema-authorization" status="FAILED" -->
<!-- declarative-schema-case-result name="112-renamed-schema" status="OK" -->
<!-- declarative-schema-case-result name="113-sequence-ownership-by-table-column" status="OK" -->
<!-- declarative-schema-case-result name="114-cycling-sequence" status="OK" -->
<!-- declarative-schema-case-result name="115-descending-sequence" status="OK" -->
<!-- declarative-schema-case-result name="116-sequence-cache-and-bounds" status="OK" -->
<!-- declarative-schema-case-result name="117-sequence-data-type" status="OK" -->
<!-- declarative-schema-case-result name="118-role-creation" status="OK" -->
<!-- declarative-schema-case-result name="119-role-membership" status="OK" -->
<!-- declarative-schema-case-result name="120-role-configuration-setting" status="OK" -->
<!-- declarative-schema-case-result name="121-table-grants" status="OK" -->
<!-- declarative-schema-case-result name="122-column-level-grants" status="OK" -->
<!-- declarative-schema-case-result name="123-sequence-grants" status="OK" -->
<!-- declarative-schema-case-result name="124-function-execution-grants" status="OK" -->
<!-- declarative-schema-case-result name="125-schema-usage-and-create-grants" status="OK" -->
<!-- declarative-schema-case-result name="126-default-table-privileges" status="OK" -->
<!-- declarative-schema-case-result name="127-default-sequence-privileges" status="OK" -->
<!-- declarative-schema-case-result name="128-default-function-privileges" status="OK" -->
<!-- declarative-schema-case-result name="129-object-ownership-transfer" status="FAILED" -->
<!-- declarative-schema-case-result name="130-security-labels" status="OK" -->
<!-- declarative-schema-case-result name="131-rls-enabled-without-policies" status="OK" -->
<!-- declarative-schema-case-result name="132-rls-forced" status="OK" -->
<!-- declarative-schema-case-result name="133-permissive-select-policy" status="OK" -->
<!-- declarative-schema-case-result name="134-restrictive-select-policy" status="OK" -->
<!-- declarative-schema-case-result name="135-insert-policy-with-with-check" status="OK" -->
<!-- declarative-schema-case-result name="136-update-policy-with-using-and-with-check" status="OK" -->
<!-- declarative-schema-case-result name="137-delete-policy" status="OK" -->
<!-- declarative-schema-case-result name="138-all-commands-policy" status="OK" -->
<!-- declarative-schema-case-result name="139-policy-for-multiple-roles" status="OK" -->
<!-- declarative-schema-case-result name="140-policy-using-auth-uid" status="OK" -->
<!-- declarative-schema-case-result name="141-policy-using-jwt-claims" status="OK" -->
<!-- declarative-schema-case-result name="142-policy-calling-a-security-definer-helper" status="OK" -->
<!-- declarative-schema-case-result name="143-policy-on-a-partitioned-table" status="OK" -->
<!-- declarative-schema-case-result name="144-policy-rename-and-expression-alteration" status="OK" -->
<!-- declarative-schema-case-result name="145-data-api-exposed-custom-schema-grants" status="OK" -->
<!-- declarative-schema-case-result name="146-publication-for-all-tables" status="OK" -->
<!-- declarative-schema-case-result name="147-publication-for-multiple-tables" status="OK" -->
<!-- declarative-schema-case-result name="148-publication-with-insert-only-operations" status="OK" -->
<!-- declarative-schema-case-result name="149-publication-with-update-and-delete-operations" status="OK" -->
<!-- declarative-schema-case-result name="150-publication-with-truncate-operations" status="OK" -->
<!-- declarative-schema-case-result name="151-publication-column-list" status="OK" -->
<!-- declarative-schema-case-result name="152-publication-row-filter" status="OK" -->
<!-- declarative-schema-case-result name="153-publication-partition-root-option" status="OK" -->
<!-- declarative-schema-case-result name="154-publication-add-and-drop-table" status="OK" -->
<!-- declarative-schema-case-result name="155-publication-schema-membership" status="OK" -->
<!-- declarative-schema-case-result name="156-logical-replication-slot-metadata-boundary" status="OK" -->
<!-- declarative-schema-case-result name="157-replica-identity-default" status="OK" -->
<!-- declarative-schema-case-result name="158-replica-identity-full" status="OK" -->
<!-- declarative-schema-case-result name="159-replica-identity-nothing" status="OK" -->
<!-- declarative-schema-case-result name="160-supabase-realtime-publication-membership" status="OK" -->
<!-- declarative-schema-case-result name="161-text-search-dictionary" status="WARNING" -->
<!-- declarative-schema-case-result name="162-text-search-template" status="FAILED" -->
<!-- declarative-schema-case-result name="163-text-search-parser" status="FAILED" -->
<!-- declarative-schema-case-result name="164-text-search-configuration-mapping-replacement" status="WARNING" -->
<!-- declarative-schema-case-result name="165-text-search-configuration-mapping-addition" status="WARNING" -->
<!-- declarative-schema-case-result name="166-text-search-configuration-mapping-drop" status="WARNING" -->
<!-- declarative-schema-case-result name="167-text-search-configuration-rename" status="WARNING" -->
<!-- declarative-schema-case-result name="168-icu-collation" status="OK" -->
<!-- declarative-schema-case-result name="169-libc-collation" status="OK" -->
<!-- declarative-schema-case-result name="170-encoding-conversion" status="OK" -->
<!-- declarative-schema-case-result name="171-extension-in-extensions-schema" status="OK" -->
<!-- declarative-schema-case-result name="172-extension-version-and-cascade-options" status="OK" -->
<!-- declarative-schema-case-result name="173-extension-owned-object-boundary" status="OK" -->
<!-- declarative-schema-case-result name="174-foreign-data-wrapper" status="OK" -->
<!-- declarative-schema-case-result name="175-foreign-server" status="OK" -->
<!-- declarative-schema-case-result name="176-user-mapping" status="OK" -->
<!-- declarative-schema-case-result name="177-foreign-table" status="OK" -->
<!-- declarative-schema-case-result name="178-supabase-vault-secret-wrapper-objects" status="OK" -->
<!-- declarative-schema-case-result name="179-supabase-auth-hook-function-and-grants" status="OK" -->
<!-- declarative-schema-case-result name="180-supabase-database-webhook-trigger-using-pg-net" status="OK" -->
<!-- declarative-schema-case-result name="181-rename-ambiguity" status="OK" -->
<!-- declarative-schema-case-result name="182-populated-column-changes" status="OK" -->
<!-- declarative-schema-case-result name="183-destructive-change-warning" status="WARNING" -->
<!-- declarative-schema-case-result name="184-dependency-ordering" status="OK" -->
<!-- declarative-schema-case-result name="185-no-op-convergence" status="OK" -->
<!-- declarative-schema-case-result name="186-grants-rls-preservation" status="OK" -->
<!-- declarative-schema-case-result name="187-deterministic-output" status="OK" -->
<!-- declarative-schema-case-result name="188-recovery-after-failure" status="OK" -->
<!-- declarative-schema-case-result name="189-schema-table-evolution" status="OK" -->
<!-- declarative-schema-case-result name="190-table-persistence" status="OK" -->
<!-- declarative-schema-case-result name="191-table-storage-parameters" status="OK" -->
<!-- declarative-schema-case-result name="192-populated-batch-columns" status="OK" -->
<!-- declarative-schema-case-result name="193-implicit-type-widening" status="OK" -->
<!-- declarative-schema-case-result name="194-column-default-evolution" status="OK" -->
<!-- declarative-schema-case-result name="195-column-not-null" status="OK" -->
<!-- declarative-schema-case-result name="196-identity-generation-mode" status="OK" -->
<!-- declarative-schema-case-result name="197-generated-column-addition" status="OK" -->
<!-- declarative-schema-case-result name="198-sequence-options" status="OK" -->
<!-- declarative-schema-case-result name="199-sequence-ownership" status="OK" -->
<!-- declarative-schema-case-result name="200-data-shape-preservation" status="OK" -->
<!-- declarative-schema-case-result name="201-constraint-property-evolution" status="OK" -->
<!-- declarative-schema-case-result name="202-foreign-key-validation" status="FAILED" -->
<!-- declarative-schema-case-result name="203-index-constraint-linkage" status="FAILED" -->
<!-- declarative-schema-case-result name="204-index-definition-evolution" status="FAILED" -->
<!-- declarative-schema-case-result name="205-advanced-index-markers" status="FAILED" -->
<!-- declarative-schema-case-result name="206-statistics-and-rules" status="OK" -->
<!-- declarative-schema-case-result name="207-partition-lifecycle" status="FAILED" -->
<!-- declarative-schema-case-result name="208-partition-attach-and-inheritance" status="FAILED" -->
<!-- declarative-schema-case-result name="209-enum-domain-evolution" status="OK" -->
<!-- declarative-schema-case-result name="210-composite-range-evolution" status="OK" -->
<!-- declarative-schema-case-result name="211-cast-operator-transform-creation" status="OK" -->
<!-- declarative-schema-case-result name="212-view-materialized-view-evolution" status="FAILED" -->
<!-- declarative-schema-case-result name="213-routine-procedure-replacement" status="FAILED" -->
<!-- declarative-schema-case-result name="214-aggregate-definition-evolution" status="OK" -->
<!-- declarative-schema-case-result name="215-trigger-definition-evolution" status="OK" -->
<!-- declarative-schema-case-result name="216-event-trigger-enable-evolution" status="OK" -->
<!-- declarative-schema-case-result name="217-cross-kind-dependency-ordering" status="FAILED" -->
<!-- declarative-schema-case-result name="218-role-membership-acl-hardening" status="OK" -->
<!-- declarative-schema-case-result name="219-rls-policy-hardening" status="FAILED" -->
<!-- declarative-schema-case-result name="220-realtime-publication-membership" status="OK" -->
<!-- declarative-schema-case-result name="221-text-search-mapping-transition" status="OK" -->
<!-- declarative-schema-case-result name="222-collation-conversion-create" status="FAILED" -->
<!-- declarative-schema-case-result name="223-extension-dependent-index" status="OK" -->
<!-- declarative-schema-case-result name="224-fdw-option-redaction" status="OK" -->
<!-- declarative-schema-case-result name="225-managed-schema-boundary" status="OK" -->
<!-- declarative-schema-case-result name="226-auth-uid-policy-hardening" status="FAILED" -->
<!-- declarative-schema-case-result name="227-storage-object-policy-hardening" status="FAILED" -->
<!-- declarative-schema-case-result name="228-realtime-message-policy-hardening" status="FAILED" -->
<!-- declarative-schema-case-result name="229-pg-net-webhook-replacement" status="FAILED" -->
<!-- declarative-schema-case-result name="230-vault-secret-data-boundary" status="FAILED" -->
<!-- declarative-schema-case-result name="231-cron-job-data-boundary" status="OK" -->
<!-- declarative-schema-case-result name="232-queue-message-data-boundary" status="OK" -->
<!-- declarative-schema-case-result name="233-pgvector-index-addition" status="OK" -->
<!-- declarative-schema-case-result name="234-postgis-index-addition" status="FAILED" -->
<!-- declarative-schema-case-result name="235-pg-graphql-acl-exposure" status="FAILED" -->
<!-- declarative-schema-case-result name="236-wrappers-openapi-server-options" status="FAILED" -->
<!-- declarative-schema-case-result name="237-tenant-modular-graphql-release" status="FAILED" -->
<!-- declarative-schema-case-result name="238-commerce-booking-billing-release" status="OK" -->
<!-- declarative-schema-case-result name="239-realtime-social-managed-boundaries" status="FAILED" -->
<!-- declarative-schema-case-result name="240-rag-search-extension-release" status="FAILED" -->
<!-- declarative-schema-case-result name="241-geospatial-analytics-integration" status="OK" -->
<!-- declarative-schema-case-result name="242-background-processing-release" status="FAILED" -->
<!-- declarative-schema-case-result name="243-audit-ledger-archive-release" status="OK" -->
<!-- declarative-schema-case-result name="244-legacy-staged-normalization" status="FAILED" -->
<!-- declarative-schema-case-result name="245-managed-schema-negative-probe" status="FAILED" -->
<!-- declarative-schema-case-result name="246-managed-boundary-retention" status="FAILED" -->
<!-- declarative-schema-case-result name="247-platform-upgrade-config-drift-no-op" status="FAILED" -->
<!-- declarative-schema-case-result name="248-extension-absence-version-diagnostic" status="OK" -->
<!-- declarative-schema-case-result name="249-jwt-custom-claims-mfa-rls" status="FAILED" -->
<!-- declarative-schema-case-result name="250-anonymous-rls" status="FAILED" -->
<!-- declarative-schema-case-result name="251-auth-hook-suite" status="OK" -->
<!-- declarative-schema-case-result name="252-auth-users-trigger-hardening" status="FAILED" -->
<!-- declarative-schema-case-result name="253-supabase-role-boundaries" status="FAILED" -->
<!-- declarative-schema-case-result name="254-auth-data-boundary-local-service" status="OK" -->
<!-- declarative-schema-case-result name="255-storage-policy-matrix" status="FAILED" -->
<!-- declarative-schema-case-result name="256-storage-reference-helpers" status="FAILED" -->
<!-- declarative-schema-case-result name="257-storage-api-data-boundary" status="FAILED" -->
<!-- declarative-schema-case-result name="258-realtime-publication-removal" status="FAILED" -->
<!-- declarative-schema-case-result name="259-filtered-column-publication" status="FAILED" -->
<!-- declarative-schema-case-result name="260-broadcast-presence-policies" status="FAILED" -->
<!-- declarative-schema-case-result name="261-database-broadcast-helper-evolution" status="FAILED" -->
<!-- declarative-schema-case-result name="262-realtime-subscription-runtime" status="FAILED" -->
<!-- declarative-schema-case-result name="263-pg-net-trigger-lifecycle" status="FAILED" -->
<!-- declarative-schema-case-result name="264-vault-backed-webhook-redaction" status="FAILED" -->
<!-- declarative-schema-case-result name="265-url-config-stability" status="OK" -->
<!-- declarative-schema-case-result name="266-edge-function-jwt-verification" status="OK" -->
<!-- declarative-schema-case-result name="267-edge-function-version-behavior" status="OK" -->
<!-- declarative-schema-case-result name="268-vault-secret-lifecycle" status="OK" -->
<!-- declarative-schema-case-result name="269-cron-runtime-diagnostic" status="OK" -->
<!-- declarative-schema-case-result name="270-pgmq-queue-lifecycle" status="OK" -->
<!-- declarative-schema-case-result name="271-cron-queue-webhook-pipeline" status="OK" -->
<!-- declarative-schema-case-result name="272-pgvector-dimension-change-safety" status="OK" -->
<!-- declarative-schema-case-result name="273-pgvector-ivfflat-options" status="FAILED" -->
<!-- declarative-schema-case-result name="274-postgis-generated-geography" status="OK" -->
<!-- declarative-schema-case-result name="275-postgis-version-availability-diagnostic" status="FAILED" -->
<!-- declarative-schema-case-result name="276-pg-graphql-comments-inflection" status="FAILED" -->
<!-- declarative-schema-case-result name="277-postgrest-schema-cache-behavior" status="FAILED" -->
<!-- declarative-schema-case-result name="278-wrappers-vault-credential-redaction" status="FAILED" -->
<!-- declarative-schema-case-result name="279-unavailable-remote-diagnostic" status="OK" -->
<!-- declarative-schema-case-result name="280-common-extension-upgrade-boundary" status="OK" -->
<!-- declarative-schema-case-result name="281-postgrest-data-api-exposure" status="OK" -->
<!-- declarative-schema-case-result name="282-api-schema-exposure-config" status="OK" -->
<!-- declarative-schema-case-result name="283-auth-storage-realtime-config" status="FAILED" -->
<!-- declarative-schema-case-result name="284-extension-config-availability" status="FAILED" -->
<!-- declarative-schema-case-result name="285-multi-file-declarative-ordering" status="FAILED" -->
<!-- declarative-schema-case-result name="286-conflicting-definitions-diagnostic" status="OK" -->
<!-- declarative-schema-case-result name="287-local-reset-idempotence" status="OK" -->
<!-- declarative-schema-case-result name="290-seed-idempotence" status="OK" -->
<!-- declarative-schema-case-result name="291-schema-data-boundary" status="FAILED" -->
<!-- declarative-schema-case-result name="292-migration-repair-squash" status="OK" -->
<!-- declarative-schema-case-result name="293-cli-version-evidence" status="OK" -->
<!-- declarative-schema-case-result name="294-pg-delta-feature-flag" status="FAILED" -->
<!-- declarative-schema-case-result name="295-interrupted-command-recovery" status="FAILED" -->
<!-- declarative-schema-case-result name="296-offline-diagnostics" status="FAILED" -->
<!-- declarative-schema-case-result name="297-managed-database-webhook-trigger" status="OK" -->
<!-- declarative-schema-case-result name="298-create-schema" status="OK" -->
<!-- declarative-schema-case-result name="299-drop-schema" status="OK" -->
<!-- declarative-schema-case-result name="300-rename-schema" status="OK" -->
<!-- declarative-schema-case-result name="301-move-schema" status="OK" -->
<!-- declarative-schema-case-result name="302-authorize-schema" status="OK" -->
<!-- declarative-schema-case-result name="303-ownership-schema" status="OK" -->
<!-- declarative-schema-case-result name="304-create-table" status="OK" -->
<!-- declarative-schema-case-result name="305-drop-table" status="OK" -->
<!-- declarative-schema-case-result name="306-rename-table" status="OK" -->
<!-- declarative-schema-case-result name="307-move-table" status="OK" -->
<!-- declarative-schema-case-result name="308-persist-unlogged" status="OK" -->
<!-- declarative-schema-case-result name="309-ownership-table" status="OK" -->
<!-- declarative-schema-case-result name="310-kind-partitioned" status="OK" -->
<!-- declarative-schema-case-result name="311-kind-inherited" status="FAILED" -->
<!-- declarative-schema-case-result name="312-kind-typed" status="OK" -->
<!-- declarative-schema-case-result name="313-kind-foreign" status="OK" -->
<!-- declarative-schema-case-result name="314-kind-identity" status="OK" -->
<!-- declarative-schema-case-result name="315-boundary-temporary" status="FAILED" -->
<!-- declarative-schema-case-result name="316-add-column-at-empty" status="OK" -->
<!-- declarative-schema-case-result name="317-add-column-at-populated" status="OK" -->
<!-- declarative-schema-case-result name="318-drop-column-at-empty" status="OK" -->
<!-- declarative-schema-case-result name="319-drop-column-at-populated" status="WARNING" -->
<!-- declarative-schema-case-result name="320-rename-column" status="OK" -->
<!-- declarative-schema-case-result name="321-reorder-column" status="FAILED" -->
<!-- declarative-schema-case-result name="322-batch-columns-at-empty" status="FAILED" -->
<!-- declarative-schema-case-result name="323-batch-columns-at-populated" status="OK" -->
<!-- declarative-schema-case-result name="324-cast-implicit" status="OK" -->
<!-- declarative-schema-case-result name="325-cast-assignment" status="OK" -->
<!-- declarative-schema-case-result name="326-cast-using" status="OK" -->
<!-- declarative-schema-case-result name="327-cast-lossy" status="FAILED" -->
<!-- declarative-schema-case-result name="328-cast-incompatible" status="FAILED" -->
<!-- declarative-schema-case-result name="329-cast-array" status="OK" -->
<!-- declarative-schema-case-result name="330-cast-domain" status="OK" -->
<!-- declarative-schema-case-result name="331-cast-enum" status="FAILED" -->
<!-- declarative-schema-case-result name="332-cast-collation" status="OK" -->
<!-- declarative-schema-case-result name="333-default-add" status="OK" -->
<!-- declarative-schema-case-result name="334-default-change" status="OK" -->
<!-- declarative-schema-case-result name="335-default-drop" status="OK" -->
<!-- declarative-schema-case-result name="336-default-volatile" status="OK" -->
<!-- declarative-schema-case-result name="337-default-expression" status="OK" -->
<!-- declarative-schema-case-result name="338-default-no-rewrite" status="OK" -->
<!-- declarative-schema-case-result name="339-notnull-add-valid" status="OK" -->
<!-- declarative-schema-case-result name="340-notnull-add-invalid" status="FAILED" -->
<!-- declarative-schema-case-result name="341-notnull-drop" status="OK" -->
<!-- declarative-schema-case-result name="342-notnull-staged" status="FAILED" -->
<!-- declarative-schema-case-result name="343-identity-add" status="OK" -->
<!-- declarative-schema-case-result name="344-identity-drop" status="OK" -->
<!-- declarative-schema-case-result name="345-identity-always" status="OK" -->
<!-- declarative-schema-case-result name="346-identity-by-default" status="OK" -->
<!-- declarative-schema-case-result name="347-identity-restart" status="FAILED" -->
<!-- declarative-schema-case-result name="348-generated-add" status="OK" -->
<!-- declarative-schema-case-result name="349-generated-change" status="OK" -->
<!-- declarative-schema-case-result name="350-generated-drop" status="OK" -->
<!-- declarative-schema-case-result name="351-compression" status="FAILED" -->
<!-- declarative-schema-case-result name="352-storage" status="OK" -->
<!-- declarative-schema-case-result name="353-statistics-target" status="OK" -->
<!-- declarative-schema-case-result name="354-column-options" status="OK" -->
<!-- declarative-schema-case-result name="355-column-privileges" status="OK" -->
<!-- declarative-schema-case-result name="356-create-sequence" status="OK" -->
<!-- declarative-schema-case-result name="357-drop-sequence" status="OK" -->
<!-- declarative-schema-case-result name="358-rename-sequence" status="OK" -->
<!-- declarative-schema-case-result name="359-move-sequence" status="OK" -->
<!-- declarative-schema-case-result name="360-sequence-type" status="OK" -->
<!-- declarative-schema-case-result name="361-sequence-increment" status="OK" -->
<!-- declarative-schema-case-result name="362-sequence-bounds" status="OK" -->
<!-- declarative-schema-case-result name="363-sequence-cache" status="OK" -->
<!-- declarative-schema-case-result name="364-sequence-cycle" status="OK" -->
<!-- declarative-schema-case-result name="365-sequence-restart" status="FAILED" -->
<!-- declarative-schema-case-result name="366-sequence-owned-by" status="OK" -->
<!-- declarative-schema-case-result name="367-sequence-ownership" status="OK" -->
<!-- declarative-schema-case-result name="368-access-method" status="FAILED" -->
<!-- declarative-schema-case-result name="369-tablespace" status="FAILED" -->
<!-- declarative-schema-case-result name="370-persistence" status="OK" -->
<!-- declarative-schema-case-result name="371-storage-params" status="OK" -->
<!-- declarative-schema-case-result name="372-replica-identity" status="OK" -->
<!-- declarative-schema-case-result name="373-rls-flags" status="OK" -->
<!-- declarative-schema-case-result name="374-clustering" status="OK" -->
<!-- declarative-schema-case-result name="375-inheritance" status="OK" -->
<!-- declarative-schema-case-result name="376-preserve-null" status="OK" -->
<!-- declarative-schema-case-result name="377-preserve-default" status="OK" -->
<!-- declarative-schema-case-result name="378-preserve-array" status="OK" -->
<!-- declarative-schema-case-result name="379-preserve-json" status="OK" -->
<!-- declarative-schema-case-result name="380-preserve-bytea" status="OK" -->
<!-- declarative-schema-case-result name="381-preserve-large-text" status="OK" -->
<!-- declarative-schema-case-result name="382-preserve-generated" status="OK" -->
<!-- declarative-schema-case-result name="383-preserve-identity" status="OK" -->
<!-- declarative-schema-case-result name="384-preserve-numeric" status="OK" -->
<!-- declarative-schema-case-result name="385-preserve-time" status="OK" -->
<!-- declarative-schema-case-result name="386-pk-create" status="OK" -->
<!-- declarative-schema-case-result name="387-pk-drop" status="OK" -->
<!-- declarative-schema-case-result name="388-unique-create" status="OK" -->
<!-- declarative-schema-case-result name="389-fk-create" status="OK" -->
<!-- declarative-schema-case-result name="390-check-create" status="OK" -->
<!-- declarative-schema-case-result name="391-exclusion-create" status="OK" -->
<!-- declarative-schema-case-result name="392-notnull-constraint" status="OK" -->
<!-- declarative-schema-case-result name="393-rename-constraint" status="OK" -->
<!-- declarative-schema-case-result name="394-fk-composite" status="OK" -->
<!-- declarative-schema-case-result name="395-fk-self" status="OK" -->
<!-- declarative-schema-case-result name="396-fk-cross-schema" status="OK" -->
<!-- declarative-schema-case-result name="397-fk-deferrable" status="OK" -->
<!-- declarative-schema-case-result name="398-fk-action" status="OK" -->
<!-- declarative-schema-case-result name="399-fk-match" status="OK" -->
<!-- declarative-schema-case-result name="400-not-valid-create" status="OK" -->
<!-- declarative-schema-case-result name="401-validate-constraint" status="OK" -->
<!-- declarative-schema-case-result name="402-validate-invalid" status="FAILED" -->
<!-- declarative-schema-case-result name="403-index-attach-constraint" status="OK" -->
<!-- declarative-schema-case-result name="404-index-replace-constraint" status="OK" -->
<!-- declarative-schema-case-result name="405-index-create" status="OK" -->
<!-- declarative-schema-case-result name="406-index-drop" status="OK" -->
<!-- declarative-schema-case-result name="407-index-rename" status="OK" -->
<!-- declarative-schema-case-result name="408-index-move" status="OK" -->
<!-- declarative-schema-case-result name="409-index-unique" status="OK" -->
<!-- declarative-schema-case-result name="410-index-method" status="OK" -->
<!-- declarative-schema-case-result name="411-index-expression" status="OK" -->
<!-- declarative-schema-case-result name="412-index-include" status="OK" -->
<!-- declarative-schema-case-result name="413-index-predicate" status="OK" -->
<!-- declarative-schema-case-result name="414-index-sort" status="OK" -->
<!-- declarative-schema-case-result name="415-index-partial" status="OK" -->
<!-- declarative-schema-case-result name="416-index-covering" status="OK" -->
<!-- declarative-schema-case-result name="417-index-multicolumn" status="OK" -->
<!-- declarative-schema-case-result name="418-index-hash" status="OK" -->
<!-- declarative-schema-case-result name="419-index-gin" status="OK" -->
<!-- declarative-schema-case-result name="420-index-gist" status="OK" -->
<!-- declarative-schema-case-result name="421-index-brin" status="OK" -->
<!-- declarative-schema-case-result name="422-index-extension" status="OK" -->
<!-- declarative-schema-case-result name="423-index-concurrent" status="FAILED" -->
<!-- declarative-schema-case-result name="424-index-invalid" status="FAILED" -->
<!-- declarative-schema-case-result name="425-index-clustered" status="OK" -->
<!-- declarative-schema-case-result name="426-index-replica-identity" status="OK" -->
<!-- declarative-schema-case-result name="427-index-duplicate" status="FAILED" -->
<!-- declarative-schema-case-result name="428-statistics-create" status="FAILED" -->
<!-- declarative-schema-case-result name="429-statistics-drop" status="FAILED" -->
<!-- declarative-schema-case-result name="430-statistics-rename" status="OK" -->
<!-- declarative-schema-case-result name="431-rule-create" status="FAILED" -->
<!-- declarative-schema-case-result name="432-rule-replace" status="FAILED" -->
<!-- declarative-schema-case-result name="433-rule-drop" status="FAILED" -->
<!-- declarative-schema-case-result name="434-rule-enable" status="FAILED" -->
<!-- declarative-schema-case-result name="435-partition-range" status="OK" -->
<!-- declarative-schema-case-result name="436-partition-list" status="OK" -->
<!-- declarative-schema-case-result name="437-partition-hash" status="OK" -->
<!-- declarative-schema-case-result name="438-partition-default" status="OK" -->
<!-- declarative-schema-case-result name="439-partition-multilevel" status="OK" -->
<!-- declarative-schema-case-result name="440-partition-add" status="OK" -->
<!-- declarative-schema-case-result name="441-partition-detach" status="OK" -->
<!-- declarative-schema-case-result name="442-partition-finalize-detach" status="FAILED" -->
<!-- declarative-schema-case-result name="443-partition-attach" status="OK" -->
<!-- declarative-schema-case-result name="444-partition-rename" status="OK" -->
<!-- declarative-schema-case-result name="445-partition-move" status="OK" -->
<!-- declarative-schema-case-result name="446-partition-drop" status="OK" -->
<!-- declarative-schema-case-result name="447-partition-bounds" status="OK" -->
<!-- declarative-schema-case-result name="448-partition-key" status="FAILED" -->
<!-- declarative-schema-case-result name="449-partition-strategy" status="FAILED" -->
<!-- declarative-schema-case-result name="450-partition-attach-populated" status="OK" -->
<!-- declarative-schema-case-result name="451-partition-attach-invalid" status="FAILED" -->
<!-- declarative-schema-case-result name="452-partition-local-index" status="OK" -->
<!-- declarative-schema-case-result name="453-partition-constraint" status="OK" -->
<!-- declarative-schema-case-result name="454-partition-trigger" status="OK" -->
<!-- declarative-schema-case-result name="455-partition-rls" status="OK" -->
<!-- declarative-schema-case-result name="456-partition-fk" status="OK" -->
<!-- declarative-schema-case-result name="457-inherit-add" status="OK" -->
<!-- declarative-schema-case-result name="458-inherit-drop" status="OK" -->
<!-- declarative-schema-case-result name="459-inherit-multiple" status="OK" -->
<!-- declarative-schema-case-result name="460-inherit-no-inherit" status="OK" -->
<!-- declarative-schema-case-result name="461-enum-create" status="OK" -->
<!-- declarative-schema-case-result name="462-enum-drop" status="OK" -->
<!-- declarative-schema-case-result name="463-enum-rename" status="OK" -->
<!-- declarative-schema-case-result name="464-enum-add-value" status="OK" -->
<!-- declarative-schema-case-result name="465-enum-rename-value" status="OK" -->
<!-- declarative-schema-case-result name="466-enum-delete-value" status="FAILED" -->
<!-- declarative-schema-case-result name="467-enum-reorder" status="FAILED" -->
<!-- declarative-schema-case-result name="468-domain-default" status="OK" -->
<!-- declarative-schema-case-result name="469-domain-not-null" status="OK" -->
<!-- declarative-schema-case-result name="470-domain-check" status="OK" -->
<!-- declarative-schema-case-result name="471-domain-collation" status="OK" -->
<!-- declarative-schema-case-result name="472-composite-add-attribute" status="OK" -->
<!-- declarative-schema-case-result name="473-composite-drop-attribute" status="OK" -->
<!-- declarative-schema-case-result name="474-composite-rename-attribute" status="OK" -->
<!-- declarative-schema-case-result name="475-range-create" status="OK" -->
<!-- declarative-schema-case-result name="476-range-rename" status="OK" -->
<!-- declarative-schema-case-result name="477-multirange-create" status="OK" -->
<!-- declarative-schema-case-result name="478-base-type-create" status="FAILED" -->
<!-- declarative-schema-case-result name="479-shell-type-create" status="FAILED" -->
<!-- declarative-schema-case-result name="480-cast-create" status="FAILED" -->
<!-- declarative-schema-case-result name="481-cast-drop" status="FAILED" -->
<!-- declarative-schema-case-result name="482-operator-create" status="FAILED" -->
<!-- declarative-schema-case-result name="483-opclass-create" status="FAILED" -->
<!-- declarative-schema-case-result name="484-aggregate-dependency" status="OK" -->
<!-- declarative-schema-case-result name="485-transform-create" status="FAILED" -->
<!-- declarative-schema-case-result name="486-transform-drop" status="FAILED" -->
<!-- declarative-schema-case-result name="487-view-create" status="OK" -->
<!-- declarative-schema-case-result name="488-view-replace" status="OK" -->
<!-- declarative-schema-case-result name="489-view-drop" status="OK" -->
<!-- declarative-schema-case-result name="490-view-rename" status="OK" -->
<!-- declarative-schema-case-result name="491-view-security-invoker" status="OK" -->
<!-- declarative-schema-case-result name="492-view-check-option" status="OK" -->
<!-- declarative-schema-case-result name="493-view-compatible" status="OK" -->
<!-- declarative-schema-case-result name="494-view-incompatible" status="FAILED" -->
<!-- declarative-schema-case-result name="495-view-recursive" status="OK" -->
<!-- declarative-schema-case-result name="496-view-cross-schema" status="OK" -->
<!-- declarative-schema-case-result name="497-view-dependency-order" status="OK" -->
<!-- declarative-schema-case-result name="498-matview-create" status="OK" -->
<!-- declarative-schema-case-result name="499-matview-replace" status="OK" -->
<!-- declarative-schema-case-result name="500-matview-refresh" status="FAILED" -->
<!-- declarative-schema-case-result name="501-matview-concurrent-refresh" status="FAILED" -->
<!-- declarative-schema-case-result name="502-routine-sql" status="OK" -->
<!-- declarative-schema-case-result name="503-routine-plpgsql" status="OK" -->
<!-- declarative-schema-case-result name="504-routine-extension-language" status="FAILED" -->
<!-- declarative-schema-case-result name="505-routine-replace" status="OK" -->
<!-- declarative-schema-case-result name="506-routine-drop" status="OK" -->
<!-- declarative-schema-case-result name="507-routine-rename" status="OK" -->
<!-- declarative-schema-case-result name="508-routine-volatility" status="OK" -->
<!-- declarative-schema-case-result name="509-routine-security" status="OK" -->
<!-- declarative-schema-case-result name="510-routine-parallel" status="OK" -->
<!-- declarative-schema-case-result name="511-routine-overload" status="OK" -->
<!-- declarative-schema-case-result name="512-routine-variadic" status="OK" -->
<!-- declarative-schema-case-result name="513-routine-normalization" status="OK" -->
<!-- declarative-schema-case-result name="514-procedure-replace" status="OK" -->
<!-- declarative-schema-case-result name="515-procedure-signature" status="OK" -->
<!-- declarative-schema-case-result name="516-aggregate-ordinary" status="OK" -->
<!-- declarative-schema-case-result name="517-aggregate-ordered-set" status="OK" -->
<!-- declarative-schema-case-result name="518-trigger-row" status="OK" -->
<!-- declarative-schema-case-result name="519-trigger-statement" status="OK" -->
<!-- declarative-schema-case-result name="520-trigger-instead-of" status="OK" -->
<!-- declarative-schema-case-result name="521-trigger-disable" status="OK" -->
<!-- declarative-schema-case-result name="522-trigger-constraint" status="OK" -->
<!-- declarative-schema-case-result name="523-event-trigger-create" status="OK" -->
<!-- declarative-schema-case-result name="524-event-trigger-enable" status="OK" -->
<!-- declarative-schema-case-result name="525-event-trigger-rename" status="OK" -->
<!-- declarative-schema-case-result name="526-event-trigger-tag-filter" status="OK" -->
<!-- declarative-schema-case-result name="527-routine-used-by-default" status="OK" -->
<!-- declarative-schema-case-result name="528-routine-used-by-view" status="OK" -->
<!-- declarative-schema-case-result name="529-role-create" status="FAILED" -->
<!-- declarative-schema-case-result name="530-role-drop" status="FAILED" -->
<!-- declarative-schema-case-result name="531-role-rename" status="OK" -->
<!-- declarative-schema-case-result name="532-role-membership" status="FAILED" -->
<!-- declarative-schema-case-result name="533-role-password-redaction" status="FAILED" -->
<!-- declarative-schema-case-result name="534-ownership-object" status="OK" -->
<!-- declarative-schema-case-result name="535-ownership-reassign" status="FAILED" -->
<!-- declarative-schema-case-result name="536-grant-table" status="OK" -->
<!-- declarative-schema-case-result name="537-grant-schema" status="OK" -->
<!-- declarative-schema-case-result name="538-grant-routine" status="OK" -->
<!-- declarative-schema-case-result name="539-grant-database" status="FAILED" -->
<!-- declarative-schema-case-result name="540-grant-parameter" status="FAILED" -->
<!-- declarative-schema-case-result name="541-grant-option" status="OK" -->
<!-- declarative-schema-case-result name="542-grant-public" status="OK" -->
<!-- declarative-schema-case-result name="543-grant-default-privileges" status="OK" -->
<!-- declarative-schema-case-result name="544-revoke-cascade" status="FAILED" -->
<!-- declarative-schema-case-result name="545-rls-enable" status="OK" -->
<!-- declarative-schema-case-result name="546-rls-force" status="OK" -->
<!-- declarative-schema-case-result name="547-policy-create" status="OK" -->
<!-- declarative-schema-case-result name="548-policy-drop" status="OK" -->
<!-- declarative-schema-case-result name="549-policy-rename" status="OK" -->
<!-- declarative-schema-case-result name="550-policy-restrictive" status="OK" -->
<!-- declarative-schema-case-result name="551-policy-auth-uid" status="OK" -->
<!-- declarative-schema-case-result name="552-policy-auth-jwt" status="OK" -->
<!-- declarative-schema-case-result name="553-policy-helper" status="OK" -->
<!-- declarative-schema-case-result name="554-security-order" status="OK" -->
<!-- declarative-schema-case-result name="555-publication-create" status="OK" -->
<!-- declarative-schema-case-result name="556-publication-drop" status="OK" -->
<!-- declarative-schema-case-result name="557-publication-rename" status="OK" -->
<!-- declarative-schema-case-result name="558-publication-membership" status="OK" -->
<!-- declarative-schema-case-result name="559-publication-row-filter" status="OK" -->
<!-- declarative-schema-case-result name="560-realtime-membership" status="OK" -->
<!-- declarative-schema-case-result name="561-realtime-replica-identity" status="OK" -->
<!-- declarative-schema-case-result name="562-subscription-create" status="FAILED" -->
<!-- declarative-schema-case-result name="563-subscription-redaction" status="FAILED" -->
<!-- declarative-schema-case-result name="564-textsearch-config-create" status="OK" -->
<!-- declarative-schema-case-result name="565-textsearch-mapping" status="FAILED" -->
<!-- declarative-schema-case-result name="566-collation-create" status="OK" -->
<!-- declarative-schema-case-result name="567-collation-drop" status="OK" -->
<!-- declarative-schema-case-result name="568-collation-rename" status="OK" -->
<!-- declarative-schema-case-result name="569-collation-version" status="FAILED" -->
<!-- declarative-schema-case-result name="570-conversion-create" status="OK" -->
<!-- declarative-schema-case-result name="571-conversion-drop" status="OK" -->
<!-- declarative-schema-case-result name="572-conversion-rename" status="OK" -->
<!-- declarative-schema-case-result name="573-language-create" status="FAILED" -->
<!-- declarative-schema-case-result name="574-language-trusted" status="FAILED" -->
<!-- declarative-schema-case-result name="575-extension-create" status="OK" -->
<!-- declarative-schema-case-result name="576-extension-drop" status="FAILED" -->
<!-- declarative-schema-case-result name="577-extension-upgrade" status="FAILED" -->
<!-- declarative-schema-case-result name="578-extension-schema-move" status="OK" -->
<!-- declarative-schema-case-result name="579-extension-owned-objects" status="OK" -->
<!-- declarative-schema-case-result name="580-extension-conflict" status="FAILED" -->
<!-- declarative-schema-case-result name="581-fdw-create" status="OK" -->
<!-- declarative-schema-case-result name="582-server-create" status="OK" -->
<!-- declarative-schema-case-result name="583-foreign-table-create" status="OK" -->
<!-- declarative-schema-case-result name="584-server-rename" status="OK" -->
<!-- declarative-schema-case-result name="585-fdw-options" status="OK" -->
<!-- declarative-schema-case-result name="586-fdw-redaction" status="OK" -->
<!-- declarative-schema-case-result name="587-fdw-import-schema" status="FAILED" -->
<!-- declarative-schema-case-result name="588-seclabel-create" status="FAILED" -->
<!-- declarative-schema-case-result name="589-seclabel-provider" status="FAILED" -->
<!-- declarative-schema-case-result name="590-boundary-access-method" status="FAILED" -->
<!-- declarative-schema-case-result name="591-boundary-large-object" status="FAILED" -->
<!-- declarative-schema-case-result name="592-boundary-database-settings" status="FAILED" -->
<!-- declarative-schema-case-result name="593-boundary-database-create" status="FAILED" -->
<!-- declarative-schema-case-result name="594-boundary-tablespace-create" status="FAILED" -->
<!-- declarative-schema-case-result name="595-boundary-temp-objects" status="FAILED" -->
<!-- declarative-schema-case-result name="596-boundary-sequence-value" status="FAILED" -->
<!-- declarative-schema-case-result name="597-boundary-prepared-xact" status="FAILED" -->
<!-- declarative-schema-case-result name="598-boundary-cluster-role" status="FAILED" -->
<!-- declarative-schema-case-result name="599-boundary-superuser" status="FAILED" -->
<!-- declarative-schema-case-result name="600-boundary-stable-diagnostic" status="FAILED" -->

