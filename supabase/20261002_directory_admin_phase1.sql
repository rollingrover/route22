-- Already applied to opdeskver2 (2 Oct 2026). Committed so the repo matches the
-- database. Additive and idempotent. A point-in-time copy of the dir_* tables,
-- companies and bookings was taken first in the private `backup` schema
-- (backup.*_20261002).

alter table public.dir_billing add column if not exists plan text;
alter table public.dir_billing add column if not exists payfast_m_payment_id text;
alter table public.dir_billing add column if not exists payfast_token text;
alter table public.dir_billing add column if not exists last_paid_at timestamptz;
alter table public.dir_billing add column if not exists payment_failed_at timestamptz;
do $c$ begin
  alter table public.dir_billing drop constraint if exists dir_billing_plan_check;
  alter table public.dir_billing add constraint dir_billing_plan_check
    check (plan is null or plan in ('premium','featured'));
end $c$;
create unique index if not exists dir_billing_m_payment_idx on public.dir_billing(payfast_m_payment_id) where payfast_m_payment_id is not null;
create index if not exists dir_billing_token_idx on public.dir_billing(payfast_token) where payfast_token is not null;

alter table public.dir_business_enquiries add column if not exists interest text;
alter table public.dir_business_enquiries add column if not exists listing_id uuid references public.dir_listings(id) on delete set null;
alter table public.dir_business_enquiries add column if not exists payment_link text;
alter table public.dir_business_enquiries add column if not exists notes text;
alter table public.dir_business_enquiries add column if not exists updated_at timestamptz not null default now();
do $c$ begin
  alter table public.dir_business_enquiries drop constraint if exists dir_business_enquiries_interest_check;
  alter table public.dir_business_enquiries add constraint dir_business_enquiries_interest_check
    check (interest is null or interest in ('free','premium','featured','opdesk','unsure'));
end $c$;
drop trigger if exists dir_business_enquiries_touch on public.dir_business_enquiries;
create trigger dir_business_enquiries_touch before update on public.dir_business_enquiries
  for each row execute function public.dir_touch_updated_at();

alter table public.dir_enquiries add column if not exists booking_id uuid references public.bookings(id) on delete set null;
create index if not exists dir_enquiries_status_idx on public.dir_enquiries(company_id, status);
