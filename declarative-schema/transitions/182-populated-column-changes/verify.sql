insert into public.populated_column_changes (
  immutable_value,
  widening_value,
  nullable_value
)
values ('new row', -1, 'new value');

select jsonb_build_object(
  'table_oid',
  'public.populated_column_changes'::regclass::oid,
  'schema_valid',
  (
    exists (
      select 1
      from pg_attribute
      where attrelid = 'public.populated_column_changes'::regclass
        and attname = 'widening_value'
        and format_type(atttypid, atttypmod) = 'bigint'
        and attnotnull
        and not attisdropped
    )
    and exists (
      select 1
      from pg_attribute
      join pg_attrdef
        on adrelid = attrelid
       and adnum = attnum
      where attrelid = 'public.populated_column_changes'::regclass
        and attname = 'defaulted_value'
        and pg_get_expr(adbin, adrelid) = '''after''::text'
        and attnotnull
        and not attisdropped
    )
    and exists (
      select 1
      from pg_attribute
      where attrelid = 'public.populated_column_changes'::regclass
        and attname = 'nullable_value'
        and attnotnull
        and not attisdropped
    )
    and exists (
      select 1
      from pg_attribute
      join pg_attrdef
        on adrelid = attrelid
       and adnum = attnum
      where attrelid = 'public.populated_column_changes'::regclass
        and attname = 'added_value'
        and format_type(atttypid, atttypmod) = 'text'
        and pg_get_expr(adbin, adrelid) = '''backfilled''::text'
        and attnotnull
        and not attisdropped
    )
  ),
  'preserved_rows_valid',
  (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from public.populated_column_changes as source_row
    where source_row.id <= 2
  ) = '[
    {
      "id": 1,
      "immutable_value": "alpha",
      "widening_value": 42,
      "defaulted_value": "before",
      "nullable_value": "present",
      "added_value": "backfilled"
    },
    {
      "id": 2,
      "immutable_value": "βeta",
      "widening_value": 2147483647,
      "defaulted_value": "custom",
      "nullable_value": "also present",
      "added_value": "backfilled"
    }
  ]'::jsonb,
  'new_defaults_valid',
  (
    select to_jsonb(source_row)
    from public.populated_column_changes as source_row
    where source_row.id = 3
  ) = '{
    "id": 3,
    "immutable_value": "new row",
    "widening_value": -1,
    "defaulted_value": "after",
    "nullable_value": "new value",
    "added_value": "backfilled"
  }'::jsonb,
  'row_count',
  (select count(*) from public.populated_column_changes)
)::text;
