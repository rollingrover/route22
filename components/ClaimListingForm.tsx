"use client";

import { useState } from "react";
import ConsentCheckbox from "./ConsentCheckbox";

type Step = "form" | "verify" | "done" | "error";

export default function ClaimListingForm({ slug, name }: { slug: string; name: string }) {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);

  const metaTag = `<meta name="route22-site-verification" content="${token}" />`;

  async function startClaim(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/claim-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", slug, email, websiteUrl, consent }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setToken(json.token);
        setStep("verify");
      } else {
        setMsg(json.error || "Something went wrong. Please try again.");
      }
    } catch {
      setMsg("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyClaim() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/claim-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", slug, token }),
      });
      const json = await res.json();
      if (res.ok && json.ok && json.verified) {
        setStep("done");
      } else {
        setMsg(
          json.error ||
            "We couldn't find the verification tag on your homepage yet. Double-check it's saved and live, then try again."
        );
      }
    } catch {
      setMsg("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (step === "done") {
    return (
      <div className="rounded-xl2 border border-line bg-paper p-6 shadow-card">
        <h3 className="mb-1 text-[1.15rem] text-bush">Ownership verified</h3>
        <p className="m-0 text-[0.9rem] text-ink-soft">
          Thanks — we&apos;ve confirmed you control {websiteUrl}. Our team will be in touch about
          setting up your full listing for {name}.
        </p>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="rounded-xl2 border border-line bg-paper p-6 shadow-card">
        <h3 className="mb-1 text-[1.15rem]">Add this tag to your homepage</h3>
        <p className="mb-3 text-[0.9rem] text-ink-soft">
          Paste this into the <code>&lt;head&gt;</code> of your website&apos;s homepage (
          {websiteUrl}), then click verify. You can remove it again afterwards.
        </p>
        <code className="mb-4 block overflow-x-auto rounded-[10px] border border-line bg-sand p-3 text-[0.82rem] text-ink">
          {metaTag}
        </code>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={verifyClaim}
            disabled={busy}
            className="rounded-full bg-clay px-5 py-2.5 font-semibold text-white hover:bg-clay-dk disabled:opacity-60"
          >
            {busy ? "Checking…" : "I've added it — verify now"}
          </button>
          <button
            type="button"
            onClick={() => setStep("form")}
            className="text-[0.85rem] font-semibold text-ink-soft underline"
          >
            Start over
          </button>
        </div>
        {msg && <p className="mt-3 text-[0.88rem] font-semibold text-clay-dk">{msg}</p>}
      </div>
    );
  }

  return (
    <form
      onSubmit={startClaim}
      className="rounded-xl2 border border-line bg-paper p-6 shadow-card"
    >
      <h3 className="mb-1 text-[1.15rem]">Claim this listing</h3>
      <p className="mb-4 text-[0.9rem] text-ink-soft">
        If {name} is your business, verify you own its website and we&apos;ll follow up about
        setting up (or upgrading) your Route22 listing.
      </p>
      <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
        Your email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
        />
      </label>
      <label className="mb-4 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
        Business website (yours to verify)
        <input
          type="url"
          required
          placeholder="https://"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
        />
      </label>
      <ConsentCheckbox
        checked={consent}
        onChange={setConsent}
        purpose="to verify my ownership of this listing and contact me about it"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-clay px-5 py-2.5 font-semibold text-white hover:bg-clay-dk disabled:opacity-60"
      >
        {busy ? "Starting…" : "Get verification tag"}
      </button>
      {msg && <p className="mt-3 text-[0.88rem] font-semibold text-clay-dk">{msg}</p>}
    </form>
  );
}
