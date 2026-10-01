"use client";

// POPIA consent checkbox, shared by every form that collects personal info.
export default function ConsentCheckbox({
  checked,
  onChange,
  purpose,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  purpose: string;
}) {
  return (
    <label className="mb-4 flex items-start gap-2.5 text-[0.82rem] leading-snug text-ink-soft">
      <input
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-clay"
      />
      <span>
        I agree that my details may be used {purpose}, as described in the{" "}
        <a href="/privacy" target="_blank" className="font-semibold text-clay underline">
          privacy notice
        </a>
        .
      </span>
    </label>
  );
}
