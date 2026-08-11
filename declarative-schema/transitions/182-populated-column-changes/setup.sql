insert into public.populated_column_changes (
  immutable_value,
  widening_value,
  nullable_value
)
values ('alpha', 42, 'present');

insert into public.populated_column_changes (
  immutable_value,
  widening_value,
  defaulted_value,
  nullable_value
)
values ('βeta', 2147483647, 'custom', 'also present');
