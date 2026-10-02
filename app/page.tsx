import { hasCategory } from "@/lib/data";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import ToursSection from "@/components/ToursSection";
import RouteMap from "@/components/RouteMap";
import Highlights from "@/components/Highlights";
import Itineraries from "@/components/Itineraries";
import Listings from "@/components/Listings";
import MoreResources from "@/components/MoreResources";
import Partner from "@/components/Partner";
import Footer from "@/components/Footer";
import { getListings } from "@/lib/listings";
import { getAmenities } from "@/lib/amenities";
import ZaHome from "@/components/ZaHome";
import { IS_ZATOURS } from "@/lib/site";

// Revalidate listings periodically so new Supabase partners appear without a redeploy.
export const revalidate = 300;

export default async function Home() {
  if (IS_ZATOURS) {
    const { listings, isExample } = await getListings();
    return (
      <>
        <Header />
        <main>
          <ZaHome listings={listings} isExample={isExample} />
        </main>
        <Footer />
      </>
    );
  }

  const [{ listings, isExample }, { amenities }] = await Promise.all([
    getListings(),
    getAmenities(),
  ]);

  const tours = listings.filter((l) => hasCategory(l, "tours"));

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <ToursSection tours={tours} isExample={isExample} />
        <RouteMap amenities={amenities} />
        <Highlights />
        <Itineraries listings={listings} />
        <Listings listings={listings} isExample={isExample} />
        <MoreResources />
        <Partner />
      </main>
      <Footer />
    </>
  );
}
