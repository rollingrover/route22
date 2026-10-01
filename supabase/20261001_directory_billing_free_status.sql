-- Already applied to opdeskver2 (migration 20261001182200). Committed here so
-- the repo matches the database. Idempotent.
-- Free listings are the default. Rows created by "send edit link" or a claim
-- approval no longer default to 'trial'.
alter table public.dir_billing drop constraint if exists dir_billing_status_check;
alter table public.dir_billing add constraint dir_billing_status_check
  check (billing_status in ('free','paid','comped','trial','lapsed'));
alter table public.dir_billing alter column billing_status set default 'free';
update public.dir_billing set billing_status = 'free'
  where billing_status = 'trial'
    and entity_type = 'listing'
    and entity_id in (select id from public.dir_listings where tier = 'community');
