create type public.transform_payload as (
  body text
);

drop transform if exists for public.transform_payload language plpgsql;
