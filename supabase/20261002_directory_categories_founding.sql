-- Already applied to opdeskver2 (2 Oct 2026). Multi-category listings +
-- founding-member price locks. Additive, idempotent. Snapshot taken first in
-- backup.dir_listings_20261002b / backup.dir_billing_20261002b.
alter table public.dir_listings add column if not exists categories text[] not null default '{}';
do $c$ begin
  alter table public.dir_listings drop constraint if exists dir_listings_categories_check;
  alter table public.dir_listings add constraint dir_listings_categories_check
    check (categories <@ array['stay','tours','wildlife','ocean','culture','eat','transport','volunteer']::text[]);
end $c$;
create or replace function public.dir_listings_sync_categories()
returns trigger language plpgsql set search_path = public as $f$
begin
  new.categories := array[new.category] || array_remove(coalesce(new.categories, '{}'::text[]), new.category);
  return new;
end $f$;
drop trigger if exists dir_listings_sync_categories on public.dir_listings;
create trigger dir_listings_sync_categories before insert or update on public.dir_listings
  for each row execute function public.dir_listings_sync_categories();
update public.dir_listings set categories = array[category] where categories = '{}' or not (category = any(categories));
create index if not exists dir_listings_categories_idx on public.dir_listings using gin (categories);
-- dir_public_listings view: `categories` appended as the last column (see live definition).
alter table public.dir_billing add column if not exists founding boolean not null default false;
alter table public.dir_billing add column if not exists locked_amount numeric(10,2);
alter table public.dir_billing add column if not exists lock_until date;
alter table public.dir_billing add column if not exists extra_categories integer not null default 0;
