import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LEGAL } from "@/lib/legal";
import { SITE_ID, absoluteUrl } from "@/lib/site";

const SITE_NAME = SITE_ID === "zatours" ? "ZAtours" : "Route22 Zululand";

export const metadata: Metadata = {
  title: `Privacy notice | ${SITE_NAME}`,
  description: `How ${SITE_NAME} (${LEGAL.company}) collects and uses personal information under POPIA.`,
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="py-16">
          <article className="mx-auto max-w-[720px] px-5 text-[0.98rem] leading-relaxed text-ink">
            <h1 className="mb-2">Privacy notice</h1>
            <p className="text-[0.85rem] text-ink-soft">Last updated {LEGAL.updated}</p>

            <h2 className="mt-8 text-[1.2rem]">Who we are</h2>
            <p>
              {SITE_NAME} is a trading line of {LEGAL.company} (registration {LEGAL.registration}),{" "}
              {LEGAL.address}. {LEGAL.company} is the responsible party for personal information
              collected on this site, as defined in the Protection of Personal Information Act, 2013
              (POPIA), and is registered with the Information Regulator under number{" "}
              {LEGAL.regulatorRegistration}. Our Information Officer is {LEGAL.informationOfficer},
              contactable at <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
            </p>
            <p>
              This notice covers what is specific to {SITE_NAME}. OpDesk&apos;s full{" "}
              <a href={LEGAL.fullPolicyUrl}>privacy policy</a> and{" "}
              <a href={LEGAL.paiaManualUrl}>PAIA manual</a> also apply.
            </p>

            <h2 className="mt-8 text-[1.2rem]">What we collect and why</h2>
            <p>
              <strong>Enquiries to listed businesses.</strong> When you enquire with a business, we
              collect your name, email, and optionally your phone number, travel dates, group size
              and message. We store this and pass it to that business so they can reply to you. If
              the business uses OpDesk, your enquiry appears in their OpDesk account.
            </p>
            <p>
              <strong>Business listings and claims.</strong> Listings show publicly available
              business contact details. When you list or claim a business, we collect your contact
              details and website to verify ownership and manage the listing.
            </p>
            <p>
              <strong>Business leads.</strong> If you ask about listing your business, we use your
              details to contact you about our services.
            </p>
            <p>We do not sell personal information and do not use it for unrelated marketing.</p>

            <h2 className="mt-8 text-[1.2rem]">Who we share it with</h2>
            <p>
              The business you enquire with, and service providers who operate this site for us:
              Supabase (database), Vercel (hosting) and Resend (email delivery). Some of these
              providers process data outside South Africa, under agreements that require them to
              protect it.
            </p>

            <h2 className="mt-8 text-[1.2rem]">Trip requests (“Plan my trip”)</h2>
            <p>
              If you send a trip request, we share your request <strong>and your name, email and phone
              number</strong> with up to three suitable tourism businesses that are paying members of our
              directory, so they can contact you with ideas and quotes. We only do this with your explicit
              consent on the form. Member businesses see the trip details first and receive your contact
              details only when they take up your request; at most three can do so. Each business then
              handles your details as a responsible party in its own right. Trip requests are no longer
              offered to businesses after 45 days or once your travel dates have passed. You can withdraw
              your request at any time by replying to our confirmation email.
            </p>

            <h2 className="mt-8 text-[1.2rem]">How long we keep it</h2>
            <p>
              Enquiries and leads are kept for up to 24 months, then deleted, unless a longer period
              is needed for a booking or by law. Once a business receives your enquiry, its own
              privacy practices also apply.
            </p>

            <h2 className="mt-8 text-[1.2rem]">Your rights</h2>
            <p>
              You may ask to see, correct or delete your personal information, or object to its
              processing, by emailing <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
              You may also complain to the Information Regulator (South Africa) at{" "}
              <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer">
                inforegulator.org.za
              </a>
              .
            </p>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
