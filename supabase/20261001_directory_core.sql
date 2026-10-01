-- =====================================================================
-- Directory core: one listings database for ZAtours + Route22, inside
-- opdeskver2, linked to OpDesk companies.
--
-- Additive only: creates dir_* tables, a view and functions. It does NOT
-- alter or touch any existing OpDesk table or row (Diza's data is untouched).
-- Idempotent: safe to run repeatedly.
--
-- Access model
--   anon/authenticated (front ends)  -> read ONLY via dir_public_listings /
--                                       dir_public_offerings views and the
--                                       dir_listing_availability() RPC
--   service role (front-end API      -> inserts enquiries/claims, admin edits
--   routes, admin)
--   OpDesk tenant users              -> read own listing; read/update own
--                                       enquiries (dashboard inbox)
--   OpDesk superadmin                -> everything
-- =====================================================================

-- ---------- shared updated_at helper ----------
create or replace function public.dir_touch_updated_at()
returns trigger language plpgsql set search_path = public as $fn$
begin
  new.updated_at := now();
  return new;
end
$fn$;

-- ---------- LISTINGS (canonical; ZAtours is the canonical URL) ----------
create table if not exists public.dir_listings (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  category        text not null,
  summary         text not null default '',
  description     text not null default '',
  town            text,
  province        text not null default 'KwaZulu-Natal',
  lat             double precision,
  lng             double precision,
  -- Public business contact details only (published from public sources
  -- or supplied by the owner). Never personal/private data.
  phone           text,
  whatsapp        text,
  email           text,
  website_url     text,
  photo_url       text,
  photo_urls      text[] not null default '{}',
  price_from      numeric,
  currency        text not null default 'ZAR',
  tier            text not null default 'community',
  sites           text[] not null default '{zatours}',
  published       boolean not null default false,
  claimed         boolean not null default false,
  company_id      uuid references public.companies(id) on delete set null,
  partner_source  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

do $c$ begin
  alter table public.dir_listings drop constraint if exists dir_listings_category_check;
  alter table public.dir_listings add constraint dir_listings_category_check
    check (category in ('stay','tours','wildlife','ocean','culture','eat','transport','volunteer'));
  alter table public.dir_listings drop constraint if exists dir_listings_tier_check;
  alter table public.dir_listings add constraint dir_listings_tier_check
    check (tier in ('community','basic','premium','featured'));
  alter table public.dir_listings drop constraint if exists dir_listings_sites_check;
  alter table public.dir_listings add constraint dir_listings_sites_check
    check (cardinality(sites) >= 1 and sites <@ array['zatours','route22']::text[]);
  alter table public.dir_listings drop constraint if exists dir_listings_slug_format;
  alter table public.dir_listings add constraint dir_listings_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
end $c$;

create index if not exists dir_listings_company_idx  on public.dir_listings(company_id);
create index if not exists dir_listings_sites_idx    on public.dir_listings using gin(sites);
create index if not exists dir_listings_category_idx on public.dir_listings(category) where published;

drop trigger if exists dir_listings_touch on public.dir_listings;
create trigger dir_listings_touch before update on public.dir_listings
  for each row execute function public.dir_touch_updated_at();

-- ---------- OFFERINGS (what used to be ZAtours "packages") ----------
create table if not exists public.dir_offerings (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references public.dir_listings(id) on delete cascade,
  slug         text not null unique,
  title        text not null,
  kind         text not null default 'tour',
  duration     text,
  price_from   numeric,
  currency     text not null default 'ZAR',
  summary      text not null default '',
  description  text not null default '',
  image_url    text,
  sort_order   integer not null default 0,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

do $c$ begin
  alter table public.dir_offerings drop constraint if exists dir_offerings_kind_check;
  alter table public.dir_offerings add constraint dir_offerings_kind_check
    check (kind in ('safari','tour','boat','overland','volunteer','stay','transfer','activity'));
end $c$;

create index if not exists dir_offerings_listing_idx on public.dir_offerings(listing_id);

drop trigger if exists dir_offerings_touch on public.dir_offerings;
create trigger dir_offerings_touch before update on public.dir_offerings
  for each row execute function public.dir_touch_updated_at();

-- ---------- ENQUIRIES (land in the operator's OpDesk inbox) ----------
create table if not exists public.dir_enquiries (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid not null references public.dir_listings(id) on delete cascade,
  offering_id   uuid references public.dir_offerings(id) on delete set null,
  company_id    uuid references public.companies(id) on delete set null, -- set by trigger
  site          text not null,
  name          text not null,
  email         text not null,
  phone         text,
  message       text not null default '',
  date_from     date,
  date_to       date,
  guests        integer,
  consent       boolean not null default false,
  status        text not null default 'new',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

do $c$ begin
  alter table public.dir_enquiries drop constraint if exists dir_enquiries_site_check;
  alter table public.dir_enquiries add constraint dir_enquiries_site_check
    check (site in ('zatours','route22','operator_site'));
  alter table public.dir_enquiries drop constraint if exists dir_enquiries_status_check;
  alter table public.dir_enquiries add constraint dir_enquiries_status_check
    check (status in ('new','replied','converted','closed','spam'));
  alter table public.dir_enquiries drop constraint if exists dir_enquiries_consent_check;
  alter table public.dir_enquiries add constraint dir_enquiries_consent_check
    check (consent);
  alter table public.dir_enquiries drop constraint if exists dir_enquiries_dates_check;
  alter table public.dir_enquiries add constraint dir_enquiries_dates_check
    check (date_to is null or date_from is null or date_to >= date_from);
end $c$;

create index if not exists dir_enquiries_company_idx on public.dir_enquiries(company_id, created_at desc);
create index if not exists dir_enquiries_listing_idx on public.dir_enquiries(listing_id);

-- company_id always comes from the listing, never from the request body,
-- so a crafted request can't drop an enquiry into another operator's inbox.
create or replace function public.dir_enquiry_set_company()
returns trigger language plpgsql set search_path = public as $fn$
declare v_company uuid; v_published boolean;
begin
  select company_id, published into v_company, v_published
    from public.dir_listings where id = new.listing_id;
  if not coalesce(v_published, false) then
    raise exception 'listing % is not published', new.listing_id;
  end if;
  new.company_id := v_company;
  new.email := lower(trim(new.email));
  return new;
end
$fn$;

drop trigger if exists dir_enquiries_set_company on public.dir_enquiries;
create trigger dir_enquiries_set_company before insert on public.dir_enquiries
  for each row execute function public.dir_enquiry_set_company();

drop trigger if exists dir_enquiries_touch on public.dir_enquiries;
create trigger dir_enquiries_touch before update on public.dir_enquiries
  for each row execute function public.dir_touch_updated_at();

-- ---------- CLAIMS (Route22 claim flow, service-role only) ----------
create table if not exists public.dir_claims (
  id                  uuid primary key default gen_random_uuid(),
  listing_id          uuid not null references public.dir_listings(id) on delete cascade,
  name                text not null,
  email               text not null,
  phone               text,
  role                text,
  verification_token  text not null unique,
  status              text not null default 'pending',
  consent             boolean not null default false,
  created_at          timestamptz not null default now(),
  resolved_at         timestamptz
);

do $c$ begin
  alter table public.dir_claims drop constraint if exists dir_claims_status_check;
  alter table public.dir_claims add constraint dir_claims_status_check
    check (status in ('pending','verified','approved','dismissed'));
end $c$;

-- ---------- BILLING (Route22 model: display tier vs. who actually pays) ----
create table if not exists public.dir_billing (
  id              uuid primary key default gen_random_uuid(),
  listing_id      uuid not null unique references public.dir_listings(id) on delete cascade,
  billing_status  text not null default 'trial',
  source          text not null default 'direct',
  owner_email     text,
  edit_token      text unique,
  paid_until      date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

do $c$ begin
  alter table public.dir_billing drop constraint if exists dir_billing_status_check;
  alter table public.dir_billing add constraint dir_billing_status_check
    check (billing_status in ('paid','comped','trial','lapsed'));
  alter table public.dir_billing drop constraint if exists dir_billing_source_check;
  alter table public.dir_billing add constraint dir_billing_source_check
    check (source in ('direct','opdesk_bundle','partner'));
end $c$;

drop trigger if exists dir_billing_touch on public.dir_billing;
create trigger dir_billing_touch before update on public.dir_billing
  for each row execute function public.dir_touch_updated_at();

-- ---------- RLS ----------
alter table public.dir_listings  enable row level security;
alter table public.dir_offerings enable row level security;
alter table public.dir_enquiries enable row level security;
alter table public.dir_claims    enable row level security;
alter table public.dir_billing   enable row level security;

-- Belt and braces: anon never touches base tables at all (only the views/RPC).
revoke all on public.dir_listings, public.dir_offerings, public.dir_enquiries,
              public.dir_claims, public.dir_billing from anon;

-- Listings: operator sees their own listing in OpDesk; superadmin manages all.
drop policy if exists dir_listings_select_own on public.dir_listings;
create policy dir_listings_select_own on public.dir_listings for select to authenticated
  using (company_id = public.current_company_id() or public.is_superadmin());
drop policy if exists dir_listings_admin_all on public.dir_listings;
create policy dir_listings_admin_all on public.dir_listings for all to authenticated
  using (public.is_superadmin()) with check (public.is_superadmin());

drop policy if exists dir_offerings_select_own on public.dir_offerings;
create policy dir_offerings_select_own on public.dir_offerings for select to authenticated
  using (public.is_superadmin() or exists (
    select 1 from public.dir_listings l
    where l.id = listing_id and l.company_id = public.current_company_id()));
drop policy if exists dir_offerings_admin_all on public.dir_offerings;
create policy dir_offerings_admin_all on public.dir_offerings for all to authenticated
  using (public.is_superadmin()) with check (public.is_superadmin());

-- Enquiries: operator inbox (read + status updates); no inserts from clients.
drop policy if exists dir_enquiries_select_own on public.dir_enquiries;
create policy dir_enquiries_select_own on public.dir_enquiries for select to authenticated
  using (company_id = public.current_company_id() or public.is_superadmin());
drop policy if exists dir_enquiries_update_own on public.dir_enquiries;
create policy dir_enquiries_update_own on public.dir_enquiries for update to authenticated
  using (company_id = public.current_company_id() or public.is_superadmin())
  with check (company_id = public.current_company_id() or public.is_superadmin());

-- Claims and billing: superadmin only (plus service role, which bypasses RLS).
drop policy if exists dir_claims_admin_all on public.dir_claims;
create policy dir_claims_admin_all on public.dir_claims for all to authenticated
  using (public.is_superadmin()) with check (public.is_superadmin());
drop policy if exists dir_billing_admin_all on public.dir_billing;
create policy dir_billing_admin_all on public.dir_billing for all to authenticated
  using (public.is_superadmin()) with check (public.is_superadmin());

-- ---------- PUBLIC READ PATH ----------
-- "verified" = linked to an active, paying (or comped) external OpDesk company.
-- Computed live, so a lapsed subscription drops the badge automatically.
create or replace view public.dir_public_listings as
select
  l.id, l.slug, l.name, l.category, l.summary, l.description, l.town, l.province,
  l.lat, l.lng, l.phone, l.whatsapp, l.email, l.website_url, l.photo_url, l.photo_urls,
  l.price_from, l.currency, l.tier, l.sites, l.claimed, l.partner_source, l.updated_at,
  (c.id is not null
     and coalesce(c.active, false)
     and c.account_status = 'active'
     and not c.is_internal
     and c.subscription_tier <> 'free'
     and (c.comped or c.subscription_expires_at is null or c.subscription_expires_at > now())
  ) as verified,
  (c.id is not null and c.public_calendar_enabled) as has_live_availability
from public.dir_listings l
left join public.companies c on c.id = l.company_id
where l.published;

create or replace view public.dir_public_offerings as
select o.id, o.listing_id, l.slug as listing_slug, o.slug, o.title, o.kind, o.duration,
       o.price_from, o.currency, o.summary, o.description, o.image_url, o.sort_order,
       l.sites
from public.dir_offerings o
join public.dir_listings l on l.id = o.listing_id
where o.published and l.published;

revoke all on public.dir_public_listings  from public, anon, authenticated;
revoke all on public.dir_public_offerings from public, anon, authenticated;
grant select on public.dir_public_listings  to anon, authenticated;
grant select on public.dir_public_offerings to anon, authenticated;

-- Per-day room availability for a linked lodge listing. Returns nothing
-- unless the operator opted in (companies.public_calendar_enabled). Uses
-- room bookings (excluding cancelled) and iCal-imported blocks, so
-- Booking.com/Airbnb stays count too. End dates are exclusive (check-out day
-- is free). Capped at 180 days per call.
create or replace function public.dir_listing_availability(p_listing_id uuid, p_from date, p_to date)
returns table(day date, units_total integer, units_busy integer)
language sql stable security definer set search_path = public as $fn$
  with l as (
    select c.id as company_id
    from public.dir_listings dl
    join public.companies c on c.id = dl.company_id
    where dl.id = p_listing_id and dl.published
      and coalesce(c.active, false) and c.account_status = 'active'
      and c.public_calendar_enabled
  ),
  r as (
    select rm.id from public.rooms rm join l on rm.company_id = l.company_id
    where coalesce(rm.active, true)
  ),
  d as (
    select gs::date as day
    from generate_series(
      greatest(p_from, current_date),
      least(p_to, greatest(p_from, current_date) + 180),
      interval '1 day') gs
  )
  select d.day,
         (select count(*) from r)::integer,
         (select count(*) from r where
            exists (select 1 from public.room_bookings rb
                    join public.bookings b on b.id = rb.booking_id
                    where rb.room_id = r.id
                      and lower(coalesce(b.status, '')) not in ('cancelled','canceled','declined')
                      and d.day >= rb.check_in and d.day < rb.check_out)
            or exists (select 1 from public.room_blocked_dates bd
                       where bd.room_id = r.id
                         and d.day >= bd.start_date and d.day < bd.end_date)
         )::integer
  from d
  where exists (select 1 from r)
  order by d.day;
$fn$;

revoke all on function public.dir_listing_availability(uuid, date, date) from public;
grant execute on function public.dir_listing_availability(uuid, date, date) to anon, authenticated;
