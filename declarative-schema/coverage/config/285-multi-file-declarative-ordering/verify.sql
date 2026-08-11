do $$
begin
  if to_regtype('public.coverage_order_state') is null then
    raise exception 'coverage_order_state is missing';
  end if;
  if to_regclass('public.coverage_order_items') is null then
    raise exception 'coverage_order_items is missing';
  end if;
  if to_regclass('public.coverage_order_summary') is null then
    raise exception 'coverage_order_summary is missing';
  end if;
end
$$;
insert into public.coverage_order_items (state) values ('queued');
do $$
begin
  if (select item_count from public.coverage_order_summary where state = 'queued') <> 1 then
    raise exception 'ordered view does not observe the table';
  end if;
end
$$;
