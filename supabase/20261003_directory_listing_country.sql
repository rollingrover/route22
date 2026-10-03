-- Already applied to opdeskver2 (3 Oct 2026): dir_listings.country (ISO code,
-- default 'ZA', check-constrained to the supported countries) + index, and
-- `country` appended as the last column of dir_public_listings.
alter table public.dir_listings add column if not exists country text not null default 'ZA';
create index if not exists dir_listings_country_idx on public.dir_listings(country);
