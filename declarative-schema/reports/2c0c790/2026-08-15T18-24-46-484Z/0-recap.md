# Supabase declarative schema CLI report

- Generated: 2026-08-16T05:34:58.031Z
- Supabase CLI version: `0.0.0-pr.6203`
- Checksum: `2c0c790`
- Primary engine: pg-delta next (`SUPABASE_USE_PG_DELTA_NEXT=true`)
- Fallback: snapshot declarative failures and transition warnings/failures are retried with legacy (`SUPABASE_USE_PG_DELTA_NEXT=false`)
- Cases: 303
- Commands OK: 2829
- Commands with warnings: 1
- Commands failed: 151
- Commands skipped: 29
- Runtime: one shared local PostgreSQL container, reset between projects
- Working copies: `.tmp\run-DHzNgi`

<a id="case-results"></a>

## Case results

| Case | Primary | Legacy | Detail |
| --- | --- | --- | --- |
| `298-create-schema` | **OK** | **NOT RUN** | [`case-298.md`](./case-298.md) |
| `299-drop-schema` | **OK** | **NOT RUN** | [`case-299.md`](./case-299.md) |
| `300-rename-schema` | **OK** | **NOT RUN** | [`case-300.md`](./case-300.md) |
| `301-move-schema` | **OK** | **NOT RUN** | [`case-301.md`](./case-301.md) |
| `302-authorize-schema` | **OK** | **NOT RUN** | [`case-302.md`](./case-302.md) |
| `303-ownership-schema` | **OK** | **NOT RUN** | [`case-303.md`](./case-303.md) |
| `304-create-table` | **OK** | **NOT RUN** | [`case-304.md`](./case-304.md) |
| `305-drop-table` | **OK** | **NOT RUN** | [`case-305.md`](./case-305.md) |
| `306-rename-table` | **OK** | **NOT RUN** | [`case-306.md`](./case-306.md) |
| `307-move-table` | **FAILED** | **FAILED** | [`case-307.md`](./case-307.md) |
| `308-persist-unlogged` | **OK** | **NOT RUN** | [`case-308.md`](./case-308.md) |
| `309-ownership-table` | **OK** | **NOT RUN** | [`case-309.md`](./case-309.md) |
| `310-kind-partitioned` | **OK** | **NOT RUN** | [`case-310.md`](./case-310.md) |
| `311-kind-inherited` | **OK** | **NOT RUN** | [`case-311.md`](./case-311.md) |
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
| `322-batch-columns-at-empty` | **OK** | **NOT RUN** | [`case-322.md`](./case-322.md) |
| `323-batch-columns-at-populated` | **OK** | **NOT RUN** | [`case-323.md`](./case-323.md) |
| `324-cast-implicit` | **OK** | **NOT RUN** | [`case-324.md`](./case-324.md) |
| `325-cast-assignment` | **OK** | **NOT RUN** | [`case-325.md`](./case-325.md) |
| `326-cast-using` | **OK** | **NOT RUN** | [`case-326.md`](./case-326.md) |
| `327-cast-lossy` | **FAILED** | **FAILED** | [`case-327.md`](./case-327.md) |
| `328-cast-incompatible` | **FAILED** | **FAILED** | [`case-328.md`](./case-328.md) |
| `329-cast-array` | **OK** | **NOT RUN** | [`case-329.md`](./case-329.md) |
| `330-cast-domain` | **OK** | **NOT RUN** | [`case-330.md`](./case-330.md) |
| `331-cast-enum` | **OK** | **NOT RUN** | [`case-331.md`](./case-331.md) |
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
| `342-notnull-staged` | **OK** | **NOT RUN** | [`case-342.md`](./case-342.md) |
| `343-identity-add` | **OK** | **NOT RUN** | [`case-343.md`](./case-343.md) |
| `344-identity-drop` | **OK** | **NOT RUN** | [`case-344.md`](./case-344.md) |
| `345-identity-always` | **OK** | **NOT RUN** | [`case-345.md`](./case-345.md) |
| `346-identity-by-default` | **OK** | **NOT RUN** | [`case-346.md`](./case-346.md) |
| `347-identity-restart` | **FAILED** | **FAILED** | [`case-347.md`](./case-347.md) |
| `348-generated-add` | **OK** | **NOT RUN** | [`case-348.md`](./case-348.md) |
| `349-generated-change` | **OK** | **NOT RUN** | [`case-349.md`](./case-349.md) |
| `350-generated-drop` | **OK** | **NOT RUN** | [`case-350.md`](./case-350.md) |
| `351-compression` | **OK** | **NOT RUN** | [`case-351.md`](./case-351.md) |
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
| `416-index-covering` | **FAILED** | **FAILED** | [`case-416.md`](./case-416.md) |
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
| `436-partition-list` | **FAILED** | **FAILED** | [`case-436.md`](./case-436.md) |
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
| `506-routine-drop` | **FAILED** | **FAILED** | [`case-506.md`](./case-506.md) |
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
| `527-routine-used-by-default` | **FAILED** | **FAILED** | [`case-527.md`](./case-527.md) |
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
| `571-conversion-drop` | **FAILED** | **FAILED** | [`case-571.md`](./case-571.md) |
| `572-conversion-rename` | **OK** | **NOT RUN** | [`case-572.md`](./case-572.md) |
| `573-language-create` | **FAILED** | **FAILED** | [`case-573.md`](./case-573.md) |
| `574-language-trusted` | **FAILED** | **FAILED** | [`case-574.md`](./case-574.md) |
| `575-extension-create` | **OK** | **NOT RUN** | [`case-575.md`](./case-575.md) |
| `576-extension-drop` | **FAILED** | **FAILED** | [`case-576.md`](./case-576.md) |
| `577-extension-upgrade` | **FAILED** | **FAILED** | [`case-577.md`](./case-577.md) |
| `578-extension-schema-move` | **FAILED** | **FAILED** | [`case-578.md`](./case-578.md) |
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

<!-- declarative-schema-case-result name="298-create-schema" status="OK" -->
<!-- declarative-schema-case-result name="299-drop-schema" status="OK" -->
<!-- declarative-schema-case-result name="300-rename-schema" status="OK" -->
<!-- declarative-schema-case-result name="301-move-schema" status="OK" -->
<!-- declarative-schema-case-result name="302-authorize-schema" status="OK" -->
<!-- declarative-schema-case-result name="303-ownership-schema" status="OK" -->
<!-- declarative-schema-case-result name="304-create-table" status="OK" -->
<!-- declarative-schema-case-result name="305-drop-table" status="OK" -->
<!-- declarative-schema-case-result name="306-rename-table" status="OK" -->
<!-- declarative-schema-case-result name="307-move-table" status="FAILED" -->
<!-- declarative-schema-case-result name="308-persist-unlogged" status="OK" -->
<!-- declarative-schema-case-result name="309-ownership-table" status="OK" -->
<!-- declarative-schema-case-result name="310-kind-partitioned" status="OK" -->
<!-- declarative-schema-case-result name="311-kind-inherited" status="OK" -->
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
<!-- declarative-schema-case-result name="322-batch-columns-at-empty" status="OK" -->
<!-- declarative-schema-case-result name="323-batch-columns-at-populated" status="OK" -->
<!-- declarative-schema-case-result name="324-cast-implicit" status="OK" -->
<!-- declarative-schema-case-result name="325-cast-assignment" status="OK" -->
<!-- declarative-schema-case-result name="326-cast-using" status="OK" -->
<!-- declarative-schema-case-result name="327-cast-lossy" status="FAILED" -->
<!-- declarative-schema-case-result name="328-cast-incompatible" status="FAILED" -->
<!-- declarative-schema-case-result name="329-cast-array" status="OK" -->
<!-- declarative-schema-case-result name="330-cast-domain" status="OK" -->
<!-- declarative-schema-case-result name="331-cast-enum" status="OK" -->
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
<!-- declarative-schema-case-result name="342-notnull-staged" status="OK" -->
<!-- declarative-schema-case-result name="343-identity-add" status="OK" -->
<!-- declarative-schema-case-result name="344-identity-drop" status="OK" -->
<!-- declarative-schema-case-result name="345-identity-always" status="OK" -->
<!-- declarative-schema-case-result name="346-identity-by-default" status="OK" -->
<!-- declarative-schema-case-result name="347-identity-restart" status="FAILED" -->
<!-- declarative-schema-case-result name="348-generated-add" status="OK" -->
<!-- declarative-schema-case-result name="349-generated-change" status="OK" -->
<!-- declarative-schema-case-result name="350-generated-drop" status="OK" -->
<!-- declarative-schema-case-result name="351-compression" status="OK" -->
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
<!-- declarative-schema-case-result name="416-index-covering" status="FAILED" -->
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
<!-- declarative-schema-case-result name="436-partition-list" status="FAILED" -->
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
<!-- declarative-schema-case-result name="506-routine-drop" status="FAILED" -->
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
<!-- declarative-schema-case-result name="527-routine-used-by-default" status="FAILED" -->
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
<!-- declarative-schema-case-result name="571-conversion-drop" status="FAILED" -->
<!-- declarative-schema-case-result name="572-conversion-rename" status="OK" -->
<!-- declarative-schema-case-result name="573-language-create" status="FAILED" -->
<!-- declarative-schema-case-result name="574-language-trusted" status="FAILED" -->
<!-- declarative-schema-case-result name="575-extension-create" status="OK" -->
<!-- declarative-schema-case-result name="576-extension-drop" status="FAILED" -->
<!-- declarative-schema-case-result name="577-extension-upgrade" status="FAILED" -->
<!-- declarative-schema-case-result name="578-extension-schema-move" status="FAILED" -->
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
