-- =====================================================================
-- Directory extras: brings Route22's remaining tables into opdeskver2 and
-- aligns dir_claims / dir_billing with Route22's existing claim + edit-link
-- code. Additive; does not touch any OpDesk table. Idempotent.
-- Reviews are deliberately NOT ported yet: they need Supabase Auth, and in
-- this project every auth signup creates an OpDesk profile (handle_new_user).
-- =====================================================================

-- ---------- reshape dir_claims / dir_billing (only while still empty) ----------
do $r$ begin
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='dir_claims' and column_name='name')
     and not exists (select 1 from public.dir_claims) then
    drop table public.dir_claims;
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='dir_billing' and column_name='listing_id')
     and not exists (select 1 from public.dir_billing) then
    drop table public.dir_billing;
  end if;
end $r$;

-- Claims: Route22's meta-tag verification flow, keyed to the listing id.
create table if not exists public.dir_claims (
  id                  uuid primary key default gen_random_uuid(),
  listing_id          uuid not null references public.dir_listings(id) on delete cascade,
  business_email      text not null,
  website_url         text not null,
  verification_token  text not null unique,
  status              text not null default 'pending',
  consent             boolean not null default false,
  created_at          timestamptz not null default now(),
  verified_at         timestamptz
);
do $c$ begin
  alter table public.dir_claims drop constraint if exists dir_claims_status_check;
  alter table public.dir_claims add constraint dir_claims_status_check
    check (status in ('pending','verified','approved','rejected'));
end $c$;
create index if not exists dir_claims_listing_idx on public.dir_claims(listing_id);

-- Billing: Route22's generic model (listing / guide / opportunity) plus the
-- source of the entitlement and a paid-until date.
create table if not exists public.dir_billing (
  id              uuid primary key default gen_random_uuid(),
  entity_type     text not null,
  entity_id       uuid not null,
  billing_status  text not null default 'trial',
  source          text not null default 'direct',
  owner_email     text,
  edit_token      text unique,
  paid_until      date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (entity_type, entity_id)
);
do $c$ begin
  alter table public.dir_billing drop constraint if exists dir_billing_entity_check;
  alter table public.dir_billing add constraint dir_billing_entity_check
    check (entity_type in ('listing','guide','opportunity'));
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

-- ---------- GUIDES ----------
create table if not exists public.dir_guides (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  specialty      text not null,
  area           text not null,
  bio            text not null default '',
  languages      text[] not null default '{}',
  certifications text not null default '',
  photo_urls     text[] not null default '{}',
  phone          text,
  whatsapp       text,
  email          text,
  website_url    text,
  tier           text not null default 'free',
  sites          text[] not null default '{route22,zatours}',
  published      boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
do $c$ begin
  alter table public.dir_guides drop constraint if exists dir_guides_tier_check;
  alter table public.dir_guides add constraint dir_guides_tier_check check (tier in ('free','premium'));
  alter table public.dir_guides drop constraint if exists dir_guides_sites_check;
  alter table public.dir_guides add constraint dir_guides_sites_check
    check (cardinality(sites) >= 1 and sites <@ array['zatours','route22']::text[]);
end $c$;
drop trigger if exists dir_guides_touch on public.dir_guides;
create trigger dir_guides_touch before update on public.dir_guides
  for each row execute function public.dir_touch_updated_at();

-- ---------- OPPORTUNITIES ----------
create table if not exists public.dir_opportunities (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  type         text not null,
  organisation text not null,
  location     text not null,
  description  text not null,
  requirements text not null default '',
  apply_url    text,
  apply_email  text,
  closes_at    date,
  tier         text not null default 'free',
  sites        text[] not null default '{route22}',
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
do $c$ begin
  alter table public.dir_opportunities drop constraint if exists dir_opportunities_type_check;
  alter table public.dir_opportunities add constraint dir_opportunities_type_check
    check (type in ('job','internship','volunteer','learnership','tender','other'));
  alter table public.dir_opportunities drop constraint if exists dir_opportunities_tier_check;
  alter table public.dir_opportunities add constraint dir_opportunities_tier_check
    check (tier in ('free','featured'));
  alter table public.dir_opportunities drop constraint if exists dir_opportunities_sites_check;
  alter table public.dir_opportunities add constraint dir_opportunities_sites_check
    check (cardinality(sites) >= 1 and sites <@ array['zatours','route22']::text[]);
end $c$;
drop trigger if exists dir_opportunities_touch on public.dir_opportunities;
create trigger dir_opportunities_touch before update on public.dir_opportunities
  for each row execute function public.dir_touch_updated_at();

-- ---------- AMENITIES (Route22 map pins) ----------
create table if not exists public.dir_amenities (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null,
  lat         double precision not null,
  lng         double precision not null,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
do $c$ begin
  alter table public.dir_amenities drop constraint if exists dir_amenities_category_check;
  alter table public.dir_amenities add constraint dir_amenities_category_check
    check (category in ('atm','bank','clinic','fastfood','fuel','other'));
end $c$;

-- ---------- BUSINESS LEADS ("list your business" form = your sales pipeline) ----------
create table if not exists public.dir_business_enquiries (
  id          uuid primary key default gen_random_uuid(),
  site        text not null,
  business    text not null,
  contact     text not null,
  email       text not null,
  phone       text,
  location    text,
  message     text,
  consent     boolean not null default false,
  status      text not null default 'new',
  created_at  timestamptz not null default now()
);
do $c$ begin
  alter table public.dir_business_enquiries drop constraint if exists dir_business_enquiries_site_check;
  alter table public.dir_business_enquiries add constraint dir_business_enquiries_site_check
    check (site in ('zatours','route22'));
  alter table public.dir_business_enquiries drop constraint if exists dir_business_enquiries_consent_check;
  alter table public.dir_business_enquiries add constraint dir_business_enquiries_consent_check
    check (consent);
  alter table public.dir_business_enquiries drop constraint if exists dir_business_enquiries_status_check;
  alter table public.dir_business_enquiries add constraint dir_business_enquiries_status_check
    check (status in ('new','contacted','won','lost'));
end $c$;

-- ---------- RLS ----------
alter table public.dir_claims             enable row level security;
alter table public.dir_billing            enable row level security;
alter table public.dir_guides             enable row level security;
alter table public.dir_opportunities      enable row level security;
alter table public.dir_amenities          enable row level security;
alter table public.dir_business_enquiries enable row level security;

-- anon: read-only on the three public content tables, nothing else.
revoke all on public.dir_claims, public.dir_billing, public.dir_business_enquiries from anon;
revoke insert, update, delete, truncate, references, trigger
  on public.dir_guides, public.dir_opportunities, public.dir_amenities from anon;
grant select on public.dir_guides, public.dir_opportunities, public.dir_amenities to anon;

drop policy if exists dir_guides_public_read on public.dir_guides;
create policy dir_guides_public_read on public.dir_guides for select
  to anon, authenticated using (published);
drop policy if exists dir_opportunities_public_read on public.dir_opportunities;
create policy dir_opportunities_public_read on public.dir_opportunities for select
  to anon, authenticated using (published and (closes_at is null or closes_at >= current_date));
drop policy if exists dir_amenities_public_read on public.dir_amenities;
create policy dir_amenities_public_read on public.dir_amenities for select
  to anon, authenticated using (published);

-- superadmin manages everything from OpDesk; the service role bypasses RLS.
do $p$
declare t text;
begin
  foreach t in array array['dir_claims','dir_billing','dir_guides','dir_opportunities',
                           'dir_amenities','dir_business_enquiries'] loop
    execute format('drop policy if exists %I on public.%I', t || '_admin_all', t);
    execute format('create policy %I on public.%I for all to authenticated
                    using (public.is_superadmin()) with check (public.is_superadmin())',
                   t || '_admin_all', t);
  end loop;
end $p$;
