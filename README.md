# Route22 Zululand

The website for the R22 / Elephant Coast tourism route through Zululand — an
interactive route map (with an optional ATM/clinic/fast-food reference layer),
reserve & town highlights, sample itineraries, a tiered business-listings
directory with individual listing pages and per-listing GPS maps (plus a free,
no-page community tier with an ownership-claim flow), a dedicated tours &
safaris section, a freelance guides & drivers directory, an industry-info
resource section, an opportunities board, social sharing on every detail page,
a partner-enquiry flow, and a password-protected admin panel.

**Stack:** Next.js 14 (App Router, TypeScript) · Tailwind CSS · Leaflet/OpenStreetMap ·
Supabase (Postgres) · Resend (transactional email) · Vercel (hosting) · Zoho (mailboxes).

---

## Pricing

Live prices — for Premium/Featured listings, Guide/Driver Premium profiles,
and the Opportunities Featured boost — are centralized in
[`lib/pricing.ts`](lib/pricing.ts), not hardcoded per component. It also
documents the South African market benchmarks each price is based on (10%
below a blended average of comparable local directories/boards). Change a
price in one place and it updates everywhere it's shown (`Partner.tsx`, the
guides and opportunities pages). Treat these as a starting point — revisit
once there's real demand signal, and add VAT handling before taking real
payments (no payment gateway is wired up yet; tiers are still set manually
via `/admin`).

## Quick start (local)

```bash
npm install          # or: pnpm install / bun install
cp .env.example .env.local   # then fill in your keys (see below)
npm run dev          # http://localhost:3000
```

The site runs **without any keys** — with no Supabase configured it shows the
clearly-marked *example* listings, and the enquiry form will report that the
system isn't set up yet. Fill in the env vars to make both live.

---

## Environment variables

Copy `.env.example` to `.env.local` (local) and add the same keys in Vercel →
Project → Settings → Environment Variables (production).

| Variable | What it is | Where it's used |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (no trailing slash) | building absolute URLs for OG/canonical tags & social share links |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | reading listings, guides, opportunities |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public, safe) | reading listings, guides, opportunities |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (**server-only, secret**) | inserting enquiries, guide & opportunity submissions |
| `RESEND_API_KEY` | Resend API key | sending enquiry/submission emails |
| `ENQUIRY_TO_EMAIL` | Your Zoho inbox that receives enquiries | e.g. `info@route22zululand.co.za` |
| `ENQUIRY_FROM_EMAIL` | Verified Resend sender on your domain | e.g. `no-reply@route22zululand.co.za` |
| `ADMIN_PASSWORD` | Shared password for `/admin` (**secret**) | admin login |
| `ADMIN_SESSION_SECRET` | Random signing secret for the admin session cookie (**secret**) — generate with `openssl rand -hex 32` | admin login |

> **Never** commit `.env.local` or put the service-role key in a `NEXT_PUBLIC_*`
> variable — that would expose it to the browser.

---

## 1. Supabase

1. Create a project at supabase.com.
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql). It
   creates the `listings`, `guides`, `opportunities`, `amenities`, `claims` and
   `enquiries` tables with row-level security: the public anon key can only
   read **published** rows (and, for opportunities, only those that haven't
   closed) — it cannot touch enquiries or claims at all; the server inserts
   and updates those with the service-role key.
3. Add listings from **Table editor → listings** (or via `/admin` — see
   below). Categories now include `tours` (safari companies/tour operators —
   these render in their own "Tours & safaris" section near the top of the
   homepage, not in the general directory, so they aren't shown twice). Set
   `tier`:
   - `community` — free, no individual page; shows as a small card (with an
     "Also along the route" / tours strip) with an upgrade prompt and a
     "claim this listing" link. This is the default for bulk/low-effort
     entries — e.g. businesses you know about but haven't onboarded as a
     paying partner. **Use this tier for anything you can't personally verify
     is accurate** — see the note on data sourcing below.
   - `basic` — free, but gets its own page at `/listings/<slug>`.
   - `premium` / `featured` — paid upgrades: badge, sorts higher, `featured`
     sorts to the very top.
   Give each a unique `slug` — that's the URL at `/listings/<slug>` (not used
   for `community` rows). Set `lat`/`lng` to show a small map of the exact
   location on that listing's page (uses the same Leaflet/OpenStreetMap setup
   as the main route map). Set `photo_url` for a thumbnail image. As soon as
   one published row exists, the site swaps the example listings for your
   real data.
4. **Guides & drivers**: submissions from the "List as a guide or driver" form
   on `/guides` arrive as unpublished rows in `public.guides`. Review and set
   `published = true` (and `tier = 'premium'` for paid profiles). Each guide
   needs a unique `slug` for its profile page at `/guides/<slug>`.
5. **Opportunities**: submissions from `/opportunities` arrive unpublished in
   `public.opportunities`. Publish and optionally set `tier = 'featured'`. Set
   `closes_at` to auto-expire a posting — expired rows stop appearing on their
   own. Each needs a unique `slug` for `/opportunities/<slug>`.
6. **Amenities** (ATMs, banks, clinics, fast food/franchise food, fuel):
   lightweight reference pins for the main route map — no pages, no
   thumbnails, just a name + category + pin, shown behind a "Show ATMs,
   clinics & fast food" checkbox so they don't clutter the main route
   markers. Add rows to `public.amenities` (admin panel or Table editor) with
   real, verified coordinates — **we did not pre-populate any real franchise
   locations**, since we can't verify addresses/coordinates for real
   businesses on your behalf; add the ones you've confirmed yourself.
7. **Claims**: when someone clicks "Is this yours? Claim it" on a community
   listing, they add a one-time HTML meta tag
   (`<meta name="route22-site-verification" content="...">`) to their own
   website's homepage. The server fetches that page and confirms the tag is
   present before marking the claim `verified` in `public.claims` — nothing
   is trusted client-side. You still approve the claim from `/admin` (or the
   Table editor), which flips `claimed = true` on the listing and bumps
   `community` listings to `basic` so they get a page.
8. Copy the URL + anon key + service-role key from **Project Settings → API**.

> **On data sourcing:** we haven't pre-loaded any real competitor or
> third-party business listings, franchise locations, or amenity coordinates.
> Inventing real business names, addresses, phone numbers or GPS pins would
> misrepresent them, so those need to come from you (or from businesses
> submitting/claiming themselves) — the `community` tier and the claim flow
> exist specifically to make it cheap to onboard real entries you *can*
> verify, in bulk, without needing owner involvement up front.

## Admin panel (`/admin`)

A password-gated dashboard for reviewing and publishing everything above.

1. Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in your env vars (see
   table above) — without both set, `/admin/login` will always reject.
2. Visit `/admin/login`, sign in, and you'll land on `/admin`, which shows:
   - Counts of pending listings/guides/opportunities and open claims.
   - **Billing** — every listing/guide/opportunity, its package, billing
     status (paid/comped/trial), and, for listings, sending the owner their
     self-edit link. See "Billing panel & self-service listing edits" below.
   - **Claims awaiting review** — approve (marks the listing `claimed`,
     upgrades it, and emails the owner their edit link) or dismiss.
   - **Listings / Guides & drivers / Opportunities / Amenities / Reviews**
     tables — publish/unpublish, change tier, or delete, all inline.
3. This is a lightweight, functional admin (server actions + a signed cookie),
   not a full RBAC system — it's a single shared password for one or a
   handful of trusted admins, similar in spirit to a staging-site basic-auth
   gate. It's excluded from the sitemap and `robots.txt`. If you need
   multiple admin accounts, audit logs, or granular roles later, that's a
   natural next step (e.g. swapping in Supabase Auth) rather than something
   this scaffold tries to solve today.

## Co-marketing partners (e.g. OpDesk)

`listings` has a `partner_source` column (free text, e.g. `"opdesk"`) — no
billing is wired up yet, so granting a partner's customer a free tier is a
manual admin action, not automation:

1. Create or find the business's listing in `/admin` (or Table editor).
2. Set its `tier` to whatever the deal grants (e.g. `premium`).
3. Set `partner_source` in the same row's admin form (e.g. `opdesk`) — this
   shows a distinct blue "Partner" badge on the listing card, its detail
   page, and the Tours section, separate from the paid-tier badges, so it's
   clear at a glance which listings came through a partnership vs. direct
   payment. `lib/data.ts`'s `partnerSourceLabel` maps known sources to a
   display label (`opdesk` → "OpDesk Partner"); anything else falls back to
   `"<value> Partner"`.

This scales to any future co-marketing deal, not just OpDesk — just use a
different `partner_source` value.

## Sponsored itineraries

Any entry in `lib/data.ts`'s `itineraries` array can carry an optional
`sponsorSlug` pointing at a listing's `slug`. If that listing is published,
its name renders as a "Sponsored by X →" link at the bottom of that
itinerary's card, linking to the listing's page. No `sponsorSlug` (or a slug
that doesn't resolve) just renders the itinerary with no sponsor strip — safe
to add speculatively.

## Reviews & sign-in (Google/Facebook via Supabase Auth)

Visitors can leave a star rating + comment on any real (non-example) listing
page, gated by signing in with Google or Facebook — that OAuth identity is
the anti-spam check; there's no separate moderation queue before a review
goes live (admins can hide or delete one from `/admin` → Reviews if needed).
One review per signed-in person per listing; they can edit or delete their
own from the same form.

To turn this on:

1. In **Google Cloud Console**, create an OAuth 2.0 Client ID (Web
   application). In **Meta for Developers**, create a Facebook App with
   Facebook Login. For both, you'll get a client ID/secret pair.
2. In your **Supabase Dashboard → Authentication → Providers**, enable Google
   and Facebook and paste in those credentials. Supabase shows you its own
   callback URL (`https://YOUR-PROJECT.supabase.co/auth/v1/callback`) — add
   that as an authorized redirect URI in both the Google and Facebook app
   settings.
3. In **Supabase Dashboard → Authentication → URL Configuration**, add
   `${NEXT_PUBLIC_SITE_URL}/auth/callback` (e.g.
   `https://www.route22zululand.co.za/auth/callback`) to the redirect URL
   allow-list — this is the route in this app (`app/auth/callback/route.ts`)
   that completes sign-in and sends the person back to the page they were on.
4. No new env vars needed beyond the Supabase ones already set — the browser
   client (`lib/supabase-browser.ts`) reuses `NEXT_PUBLIC_SUPABASE_URL` /
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Until this is configured, the reviews widget just shows existing reviews (if
any) with no sign-in buttons, rather than erroring.

## Billing panel & self-service listing edits

`/admin` has a **Billing** section listing every listing, guide and
opportunity with its package (tier) and billing status:

- **Billing status** (`paid` / `comped` / `trial`) is independent of tier —
  a listing can sit on `tier = 'premium'` while `billing_status = 'comped'`.
  The public site shows the same badge either way; this is purely for your
  own bookkeeping on who's actually paying vs. a pro-bono/early-adopter
  placement. Set it from the dropdown in that row.
- **Owner email / edit link** (listings only): enter the business owner's
  email and click **Send edit link** to email them a one-time link to
  `/listings/edit/<slug>?token=...`. No account or password — the token in
  the link *is* the credential, checked server-side against the `billing`
  table (which the anon key can never read) before anything renders or
  saves. They can edit description, phone, website, photo and map
  coordinates; name, category, location, tier, published and partner
  attribution stay admin-only. This also fires automatically when you
  **approve a claim** (Claims section) — no separate step needed for
  businesses that came through `/claim`.
- Both mechanisms read/write the `billing` table (`supabase/schema.sql`),
  which — like `claims` and `enquiries` — has no public policies at all, so
  none of this (status, email, token) is ever queryable by the anon key.
- This currently covers **listings** end-to-end; guides and opportunities
  only get the billing-status half (no edit link yet), since they're
  self-submitted already and don't go through `/claim`. Extending the same
  edit-link pattern to them is a small follow-on if it's ever worth it.

## 2. Resend (form email routing)

1. Create a Resend account and **verify your domain** `route22zululand.co.za`
   (add the DNS records Resend gives you).
2. Create an API key → `RESEND_API_KEY`.
3. Set `ENQUIRY_FROM_EMAIL` to a verified sender on that domain and
   `ENQUIRY_TO_EMAIL` to the Zoho mailbox where you want enquiries delivered.

## 3. Zoho (mailboxes)

Zoho hosts your actual mailboxes (`info@`, `bookings@`, …). Point your domain's
**MX records** at Zoho per their setup wizard. Resend only *sends* mail; Zoho
*receives* it — so an enquiry sent by Resend lands in your Zoho inbox.

> Note: Resend (sending) and Zoho (receiving) both add DNS records to the same
> domain. Zoho owns **MX**; Resend adds **SPF/DKIM (TXT)** and a tracking
> **CNAME**. They don't conflict — just add both sets.

## 4. Vercel (hosting + your domain)

1. Push this repo to GitHub.
2. In Vercel, **New Project → Import** the repo (framework auto-detects Next.js).
3. Add all env vars from the table above.
4. Deploy. Then **Settings → Domains → Add** `route22zululand.co.za` (and
   `www.`) and update your registrar's DNS as Vercel instructs.

---

## Editing content

- **Route stops, highlights, itineraries** — [`lib/data.ts`](lib/data.ts).
- **Parks & reserve pages** — [`lib/parks.ts`](lib/parks.ts). Each entry renders both a
  clickable card in the Highlights section and its own SEO page at `/parks/<slug>`
  (title, meta description, keywords and structured data are generated per park).
  Add a park by appending an object; the card and page appear automatically.
- **Industry Info articles** — [`lib/industry.ts`](lib/industry.ts). Same
  content-as-data pattern as parks: each entry renders a card on `/industry` and
  its own page at `/industry/<slug>` with Article structured data. Add a post by
  appending an object — keep to well-established general facts, no invented
  statistics, prices, dates or quotes.
- **Real listings, guides & opportunities** — live in Supabase (not in code); the
  example arrays in `lib/data.ts`, `lib/guides.ts` and `lib/opportunities.ts` are
  only the fallback/demo data shown when a table is unconfigured or empty.
- **"Where to eat" already works** — `eat` is one of the six listing
  categories, and it goes through the same `community → basic → premium →
  featured` tier system as everything else. Restaurants, takeaways and
  shisanyamas can already list free (community/basic) or upgrade
  (premium/featured) with no extra code — just add them with `category: 'eat'`.
- **Logo** — `public/logo.png` (full stacked logo, used in the intro) and
  `public/logo-mark.png` (elephant mark, used in the header/footer). `app/icon.png`
  is the browser-tab favicon. Replace these files to swap the branding.
- **Map line & markers** — `stops` + `routeLine` in `lib/data.ts`.
- **Colours & type** — [`tailwind.config.ts`](tailwind.config.ts).
- **Tier pricing** — [`lib/pricing.ts`](lib/pricing.ts), shown on `components/Partner.tsx` and the guides/opportunities pages.

## Project structure

```
app/
  layout.tsx                       root layout + metadata (metadataBase from NEXT_PUBLIC_SITE_URL)
  sitemap.ts                       generated sitemap.xml (homepage + all dynamic routes)
  robots.ts                        generated robots.txt, points at sitemap.xml, disallows /admin & /api
  page.tsx                         composes the homepage, fetches listings + amenities (revalidates every 5 min)
  api/enquiry/route.ts             POST handler: stores enquiry (Supabase) + emails it (Resend)
  api/guide-submission/route.ts    POST handler: stores a free guide/driver submission + emails it
  api/opportunity-submission/route.ts  POST handler: stores an opportunity submission + emails it
  api/claim-listing/route.ts       POST handler: start/verify a listing-ownership claim (meta-tag check)
  api/edit-listing/route.ts        POST handler: validates the edit token against `billing`, updates owner-editable fields
  auth/callback/route.ts           Supabase Auth OAuth callback (Google/Facebook sign-in for reviews)
  parks/[slug]/page.tsx            static SEO reserve/town pages (content-as-data)
  industry/page.tsx, industry/[slug]/page.tsx     industry-info index + articles (content-as-data)
  guides/page.tsx, guides/[slug]/page.tsx         guides & drivers directory + profiles (Supabase)
  opportunities/page.tsx, opportunities/[slug]/page.tsx  opportunities board + detail (Supabase)
  listings/[slug]/page.tsx         individual listing detail pages incl. GPS map + reviews (Supabase)
  listings/edit/[slug]/page.tsx    self-service edit page — validates the token server-side, then renders EditListingForm
  claim/page.tsx                   claim-listing wizard (looked up by ?slug=)
  admin/page.tsx, admin/login/page.tsx, admin/actions.ts   password-gated admin dashboard incl. Billing panel
components/             Header, Hero, Intro, RouteMap (+MapInner), Highlights,
                        Itineraries, ToursSection, Listings, MoreResources,
                        Partner (tiers + form), Footer, ShareButtons,
                        ListingMap (+ListingMapInner), ClaimListingForm,
                        EditListingForm (self-service listing edits),
                        ReviewsSection (Google/Facebook sign-in + ratings),
                        GuidesDirectory, GuideSubmitForm,
                        OpportunitiesBoard, OpportunitySubmitForm
lib/
  data.ts               route stops/highlights/itineraries + Listing type, categoryLabel/categoryHue, example listings
  parks.ts               parks/reserves content + getPark()
  industry.ts            industry-info articles + getIndustryPost()
  listings.ts             fetch published listings (+ single/claim-lookup by slug), fall back to examples
  guides.ts               fetch published guides (+ single guide by slug), fall back to examples
  opportunities.ts        fetch published, unexpired opportunities, fall back to examples
  amenities.ts             fetch published amenities (ATM/bank/clinic/fast food/fuel), fall back to examples
  reviews.ts               fetch published reviews for a listing (no example fallback — real feedback only)
  pricing.ts               centralized ZAR pricing for paid tiers, with the market-benchmark workings
  tokens.ts                random bearer-token generator, used by claims and the billing/edit-link system
  admin-auth.ts            signs/verifies the admin session cookie (HMAC, no external auth deps)
  supabase.ts             anon + service-role clients (null-safe when unconfigured)
  supabase-browser.ts      browser Supabase client carrying the visitor's auth session (for reviews)
  supabase-server-auth.ts  server Supabase client used only by the OAuth callback route
  site.ts                 absoluteUrl() helper built from NEXT_PUBLIC_SITE_URL
  slugify.ts               slug generator used by the submission API routes
supabase/schema.sql     tables (listings, guides, opportunities, amenities, claims, reviews, billing, enquiries) + RLS policies
```
