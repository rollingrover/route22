// Physical table names in the shared OpDesk Supabase project (opdeskver2).
// Route22 and ZAtours share one listings database; every directory table is
// prefixed dir_ so it can never collide with OpDesk's own tables.
//
// Public pages read listings ONLY through the dir_public_listings view (which
// computes the "verified" badge live from the linked OpDesk subscription).
// Writes go through the service-role client in route handlers / admin actions.
export const T = {
  listings: "dir_listings",
  publicListings: "dir_public_listings",
  guides: "dir_guides",
  opportunities: "dir_opportunities",
  amenities: "dir_amenities",
  billing: "dir_billing",
  claims: "dir_claims",
  businessEnquiries: "dir_business_enquiries",
  enquiries: "dir_enquiries",
} as const;
