-- Route22 Zululand — Supabase schema
-- Run this in the Supabase SQL editor (or via the CLI) to create the tables.

-- ---------- LISTINGS ----------
create table if not exists public.listings (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  category     text not null check (category in ('stay','wildlife','ocean','culture','eat','tours')),
  location     text not null,
  description  text default '',
  tier         text not null default 'community' check (tier in ('community','basic','premium','featured')),
  website_url  text,
  phone        text,
  photo_url    text,
  lat          double precision,
  lng          double precision,
  claimed      boolean not null default false,
  -- Free-text co-marketing attribution (e.g. 'opdesk'). Admin-set only — the
  -- public submission routes never write this column. Drives the "Partner"
  -- badge on the front end.
  partner_source text,
  published    boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ---------- FREELANCE GUIDES ----------
create table if not exists public.guides (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  specialty      text not null,
  area           text not null,
  bio            text default '',
  languages      text[] default '{}',
  certifications text default '',
  photo_urls     text[] default '{}',
  phone          text,
  whatsapp       text,
  email          text,
  website_url    text,
  tier           text not null default 'free' check (tier in ('free','premium')),
  published      boolean not null default false,
  created_at     timestamptz not null default now()
);

-- ---------- OPPORTUNITIES BOARD ----------
create table if not exists public.opportunities (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  type         text not null check (type in ('job','internship','volunteer','learnership','tender','other')),
  organisation text not null,
  location     text not null,
  description  text not null,
  requirements text default '',
  apply_url    text,
  apply_email  text,
  closes_at    date,
  tier         text not null default 'free' check (tier in ('free','featured')),
  published    boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ---------- AMENITIES (franchise restaurants, ATMs, banks, clinics, etc.) ----------
-- Lightweight reference points on the route map — NOT full listings: no
-- individual pages, no thumbnails, just a name + category + pin so travellers
-- can find the nearest ATM/clinic without cluttering the main route map.
-- Owner/admin-managed only (no public submission form).
create table if not exists public.amenities (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null check (category in ('atm','bank','clinic','fastfood','fuel','other')),
  lat         double precision not null,
  lng         double precision not null,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- LISTING CLAIMS (ownership verification) ----------
-- A business owner claims a free/community listing by adding a one-time HTML
-- meta tag to their own website's homepage; the server fetches that URL and
-- confirms the tag is present before marking the claim verified. Claims never
-- write to `listings` directly from the client — verification happens
-- server-side, and an admin still reviews/actions the claim.
create table if not exists public.claims (
  id                  uuid primary key default gen_random_uuid(),
  listing_slug        text not null,
  business_email      text not null,
  website_url         text not null,
  verification_token  text not null unique,
  status              text not null default 'pending' check (status in ('pending','verified','approved','rejected')),
  created_at          timestamptz not null default now(),
  verified_at         timestamptz
);

-- ---------- ENQUIRIES (business listing enquiries from the form) ----------
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  business    text not null,
  contact     text not null,
  email       text not null,
  phone       text,
  location    text,
  message     text,
  created_at  timestamptz not null default now()
);

-- ---------- ROW LEVEL SECURITY ----------
alter table public.listings      enable row level security;
alter table public.enquiries     enable row level security;
alter table public.guides        enable row level security;
alter table public.opportunities enable row level security;
alter table public.amenities     enable row level security;
alter table public.claims        enable row level security;

-- Anyone (anon key) may READ only published listings.
drop policy if exists "public read published listings" on public.listings;
create policy "public read published listings"
  on public.listings for select
  using (published = true);

-- Anyone (anon key) may READ only published guides.
drop policy if exists "public read published guides" on public.guides;
create policy "public read published guides"
  on public.guides for select
  using (published = true);

-- Anyone (anon key) may READ only published, unexpired opportunities.
-- Expired posts (closes_at in the past) drop off automatically.
drop policy if exists "public read published opportunities" on public.opportunities;
create policy "public read published opportunities"
  on public.opportunities for select
  using (published = true and (closes_at is null or closes_at >= current_date));

-- Anyone (anon key) may READ only published amenities.
drop policy if exists "public read published amenities" on public.amenities;
create policy "public read published amenities"
  on public.amenities for select
  using (published = true);

-- No public insert/update on listings/guides/opportunities/amenities — all
-- submissions are inserted server-side (published = false) using the
-- service-role key via the site's submission API routes, then reviewed and
-- published from the Supabase dashboard or the /admin panel.

-- Enquiries and claims: the anon key gets NO access at all (no policies =>
-- anon cannot read or write). Inserts and updates happen server-side using
-- the service-role key, which bypasses RLS — in /api/enquiry, /api/claim-listing,
-- and the /admin server actions.

-- ---------- REVIEWS ----------
-- Visitor reviews, gated by Supabase Auth (Google/Facebook sign-in) rather
-- than a submission queue: a real OAuth identity is the anti-spam check, so
-- reviews publish immediately — admins can still hide/delete one from
-- /admin if needed. One review per signed-in user per listing.
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  listing_slug  text not null,
  user_id       uuid not null references auth.users(id) on delete cascade,
  display_name  text not null,
  rating        smallint not null check (rating between 1 and 5),
  comment       text not null,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (listing_slug, user_id)
);

alter table public.reviews enable row level security;

-- Anyone (anon key) may read published reviews.
drop policy if exists "public read published reviews" on public.reviews;
create policy "public read published reviews"
  on public.reviews for select
  using (published = true);

-- Only a signed-in user may insert a review, and only as themselves.
drop policy if exists "signed-in users insert own review" on public.reviews;
create policy "signed-in users insert own review"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

-- A signed-in user may edit or delete only their own review.
drop policy if exists "users manage own review" on public.reviews;
create policy "users manage own review"
  on public.reviews for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users delete own review" on public.reviews;
create policy "users delete own review"
  on public.reviews for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------- BILLING & SELF-SERVICE EDIT ACCESS ----------
-- One row per entity you want to track billing/ownership for (currently
-- listings; the same table extends to guides/opportunities later without a
-- schema change). Deliberately a SEPARATE table from listings/guides/
-- opportunities, with NO public policies at all, so none of this is ever
-- queryable by the anon key — unlike published/tier/etc., which are meant to
-- be public, billing_status, owner_email and edit_token are not.
--
-- billing_status: whether this entity is actually paying, or comped/trial —
--   independent of its tier. A listing can sit on tier='premium' while
--   billing_status='comped' (e.g. an early pro-bono partner): the public
--   site shows the same Premium treatment either way, but you can see
--   internally who's real revenue vs. goodwill.
-- owner_email + edit_token: the self-service edit-link mechanism. A random
--   token emailed to the owner lets them edit their own listing at
--   /listings/edit/<slug>?token=... with no account/password — the token
--   itself is the credential, checked server-side against this table.
create table if not exists public.billing (
  id             uuid primary key default gen_random_uuid(),
  entity_type    text not null check (entity_type in ('listing','guide','opportunity')),
  entity_id      uuid not null,
  billing_status text not null default 'paid' check (billing_status in ('paid','comped','trial')),
  owner_email    text,
  edit_token     text unique,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (entity_type, entity_id)
);

alter table public.billing enable row level security;
-- No select/insert/update/delete policies at all => the anon key has zero
-- access, exactly like claims and enquiries. Only the service-role key
-- (admin actions, the edit-listing API route) can touch this table.

-- ---------- MIGRATION NOTES (only needed if you already ran an earlier
-- version of this file against a live database — a fresh run doesn't need
-- these, since `create table` already includes every column) ----------
-- alter table public.listings add column if not exists photo_url text;
-- alter table public.listings add column if not exists lat double precision;
-- alter table public.listings add column if not exists lng double precision;
-- alter table public.listings add column if not exists claimed boolean not null default false;
-- alter table public.listings add column if not exists partner_source text;

-- ---------- OPTIONAL SEED (a couple of demo rows; delete before launch) ----------
-- insert into public.listings (slug, name, category, location, description, tier, published) values
--   ('your-lodge-here', 'Your Lodge Here', 'stay', 'Hluhluwe', 'Your description.', 'featured', true);
