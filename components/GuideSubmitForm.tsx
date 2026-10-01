"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

export default function GuideSubmitForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/guide-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        setMsg("Thanks — we've received your profile and will review it shortly.");
        form.reset();
      } else {
        setStatus("error");
        setMsg(json.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <form
      id="list-as-guide"
      onSubmit={onSubmit}
      className="mx-auto max-w-[720px] rounded-xl2 border border-line bg-paper p-[30px] shadow-card"
    >
      <h3 className="mt-0">List as a guide or driver (free)</h3>
      <p className="mb-4 text-[0.9rem] text-ink-soft">
        Submit your profile for review. Once approved it appears in the directory — you can upgrade
        to a Premium profile at any time.
      </p>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required />
        <Field label="Specialty (e.g. Dive guide, Safari guide, Transfer driver)" name="specialty" required />
        <Field label="Area on the route" name="area" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
        Short bio
        <textarea
          name="bio"
          rows={4}
          required
          className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
        />
      </label>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label="Phone (optional)" name="phone" type="tel" />
        <Field label="WhatsApp (optional)" name="whatsapp" type="tel" />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-clay px-6 py-3 font-semibold text-white hover:bg-clay-dk disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit profile"}
      </button>
      {msg && (
        <p
          className={`mt-3 min-h-[1.2em] text-[0.9rem] font-semibold ${
            status === "error" ? "text-clay-dk" : "text-bush"
          }`}
        >
          {msg}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
      {label}
      {required ? " *" : ""}
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
      />
    </label>
  );
}
