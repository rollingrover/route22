"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

const typeOptions = [
  { value: "job", label: "Job" },
  { value: "internship", label: "Internship" },
  { value: "volunteer", label: "Volunteer" },
  { value: "learnership", label: "Learnership" },
  { value: "tender", label: "Tender" },
  { value: "other", label: "Other" },
];

export default function OpportunitySubmitForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/opportunity-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        setMsg("Thanks — your posting is on its way for review.");
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
      id="post-opportunity"
      onSubmit={onSubmit}
      className="mx-auto max-w-[720px] rounded-xl2 border border-line bg-paper p-[30px] shadow-card"
    >
      <h3 className="mt-0">Post an opportunity</h3>
      <p className="mb-4 text-[0.9rem] text-ink-soft">
        Submit a job, internship, volunteer role, learnership or tender for review. Featured
        placement (top of the board, with a badge) is available as a paid upgrade.
      </p>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label="Title" name="title" required />
        <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
          Type *
          <select
            name="type"
            required
            defaultValue="job"
            className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
          >
            {typeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <Field label="Organisation" name="organisation" required />
        <Field label="Location" name="location" required />
      </div>
      <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
        Description *
        <textarea
          name="description"
          rows={4}
          required
          className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
        />
      </label>
      <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
        Requirements
        <textarea
          name="requirements"
          rows={3}
          className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
        />
      </label>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label="Apply URL" name="applyUrl" type="url" />
        <Field label="Apply email" name="applyEmail" type="email" />
      </div>
      <Field label="Closing date (optional)" name="closesAt" type="date" />
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 rounded-full bg-clay px-6 py-3 font-semibold text-white hover:bg-clay-dk disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit opportunity"}
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
