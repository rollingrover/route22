"use client";

import { useState } from "react";
import { Listing } from "@/lib/data";

export default function EditListingForm({ slug, token, listing }: { slug: string; token: string; listing: Listing }) {
  const [description, setDescription] = useState(listing.desc);
  const [websiteUrl, setWebsiteUrl] = useState(listing.websiteUrl ?? "");
  const [phone, setPhone] = useState(listing.phone ?? "");
  const [photoUrl, setPhotoUrl] = useState(listing.photoUrl ?? "");
  const [lat, setLat] = useState(listing.lat?.toString() ?? "");
  const [lng, setLng] = useState(listing.lng?.toString() ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/edit-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, token, description, websiteUrl, phone, photoUrl, lat, lng }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        setMsg("Saved.");
      } else {
        setStatus("error");
        setMsg(json.error || "Couldn't save your changes.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl2 border border-line bg-paper p-6 shadow-card"
    >
      <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
        />
      </label>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
          Phone
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
          />
        </label>
        <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
          Website
          <input
            type="url"
            placeholder="https://"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
          />
        </label>
      </div>
      <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
        Photo URL
        <input
          type="url"
          placeholder="https://"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
        />
      </label>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
          Latitude
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
          />
        </label>
        <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
          Longitude
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
          />
        </label>
      </div>
      <p className="mb-4 text-[0.78rem] text-ink-soft">
        Latitude/longitude control the small map on your listing page — leave blank if you&apos;re
        not sure of your exact coordinates.
      </p>
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-clay px-6 py-2.5 font-semibold text-white hover:bg-clay-dk disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save changes"}
      </button>
      {msg && (
        <p
          className={`mt-3 text-[0.88rem] font-semibold ${status === "error" ? "text-clay-dk" : "text-bush"}`}
        >
          {msg}
        </p>
      )}
    </form>
  );
}
