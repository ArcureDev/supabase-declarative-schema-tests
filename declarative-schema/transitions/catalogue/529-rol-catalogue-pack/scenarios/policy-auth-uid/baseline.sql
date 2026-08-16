-- Covers PG-CAT-ROL-06::policy.auth-uid. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_policy_auth_uid (
  id bigint primary key, label text
);
