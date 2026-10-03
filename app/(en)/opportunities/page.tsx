import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OpportunitiesBoard from "@/components/OpportunitiesBoard";
import OpportunitySubmitForm from "@/components/OpportunitySubmitForm";
import { getOpportunities } from "@/lib/opportunities";
import { absoluteUrl, IS_ZATOURS, route22Only } from "@/lib/site";
import { formatZAR, pricing } from "@/lib/pricing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Opportunities — Jobs, Internships & More | Route22",
  description:
    "Browse jobs, internships, volunteer roles, learnerships and tenders along the Elephant Coast route in KwaZulu-Natal, or post an opportunity for tourism-industry employers.",
  keywords: [
    "tourism jobs KwaZulu-Natal",
    "safari lodge jobs",
    "field guide internship",
    "conservation volunteer South Africa",
  ],
  alternates: { canonical: absoluteUrl("/opportunities") },
  openGraph: {
    title: "Opportunities on the Elephant Coast | Route22",
    description: "Jobs, internships, volunteer roles, learnerships and tenders along the route.",
    type: "website",
    url: absoluteUrl("/opportunities"),
  },
};

export default async function OpportunitiesPage() {
  route22Only(); // Route22 corridor content — 404 on ZAtours
  const { opportunities, isExample } = await getOpportunities();

  return (
    <>
      <Header />
      <main>
        <section className="py-16">
          <div className="mx-auto max-w-[1120px] px-5">
            <div className="mb-8 max-w-[720px]">
              <h1>Opportunities</h1>
              <p className="text-ink-soft">
                Jobs, internships, volunteer roles, learnerships and tenders from tourism businesses
                and conservation organisations along the route.
              </p>
            </div>
            <OpportunitiesBoard opportunities={opportunities} isExample={isExample} />
          </div>
        </section>

        <section className="border-t border-line bg-sand py-16">
          <div className="mx-auto max-w-[1120px] px-5">
            <div className="mb-8 max-w-[720px]">
              <h2>Hiring or recruiting?</h2>
              <p className="text-ink-soft">
                Post an opportunity for free, or go Featured (
                {formatZAR(pricing.opportunitiesFeatured.amount)} per posting) for top placement and
                a badge.
              </p>
            </div>
            <OpportunitySubmitForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
