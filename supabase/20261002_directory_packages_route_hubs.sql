-- Already applied to opdeskver2 (2 Oct 2026): single directory price list
-- (dir_packages) + Route Hubs (dir_routes, dir_route_members) with public
-- read-only views dir_public_routes / dir_public_route_members.
-- dir_billing: entity_type 'route', new plan keys, quantity column.
-- dir_business_enquiries: interest 'route_hub'.
-- Snapshot taken first: backup.dir_billing_20261002c.
-- See the live definitions in Supabase for the full DDL (tables, RLS
-- policies: public read on dir_packages; superadmin-only writes everywhere).
alter table public.dir_billing add column if not exists quantity integer not null default 1;
