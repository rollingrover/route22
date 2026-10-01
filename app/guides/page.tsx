import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuidesDirectory from "@/components/GuidesDirectory";
import GuideSubmitForm from "@/components/GuideSubmitForm";
import { getGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site";
import { formatZAR, pricing } from "@/lib/pricing";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Guides & Drivers — Safari, Dive, Birding, Fishing & Transfer Guides | Route22",
  description:
    "Find freelance guides and drivers on the Elephant Coast route: Sodwana dive guides, Hluhluwe safari guides, Mkhuze birding guides, Kosi Bay fishing guides, cultural guides and transfer drivers across Zululand.",
  keywords: [
    "freelance safari guide KwaZulu-Natal",
    "Sodwana dive guide",
    "Hluhluwe safari guide",
    "Kosi Bay fishing guide",
    "birding guide Zululand",
    "private driver Zululand",
    "transfer driver Elephant Coast",
  ],
  alternates: { canonical: absoluteUrl("/guides") },
  openGraph: {
    title: "Guides & Drivers on the Elephant Coast | Route22",
    description:
      "Independent safari, dive, birding, fishing, cultural guides and transfer drivers working the Route22 corridor.",
    type: "website",
    url: absoluteUrl("/guides"),
  },
};

export default async function GuidesPage() {
  const { guides, isExample } = await getGuides();

  return (
    <>
      <Header />
      <main>
        <section className="py-16">
          <div className="mx-auto max-w-[1120px] px-5">
            <div className="mb-8 max-w-[720px]">
              <h1>Guides &amp; drivers</h1>
              <p className="text-ink-soft">
                Independent safari, dive, birding, fishing and cultural guides — plus transfer and
                private drivers — working the Elephant Coast route. Book a specialist who knows the
                ground.
              </p>
            </div>
            <GuidesDirectory guides={guides} isExample={isExample} />
          </div>
        </section>

        <section className="border-t border-line bg-sand py-16">
          <div className="mx-auto max-w-[1120px] px-5">
            <div className="mb-8 max-w-[720px]">
              <h2>Are you a freelance guide or driver?</h2>
              <p className="text-ink-soft">
                List your profile for free, or go Premium ({formatZAR(pricing.guidesPremium.amount)}
                /month) for a richer profile, top placement and an enquiry button straight to your
                inbox.
              </p>
            </div>
            <GuideSubmitForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
