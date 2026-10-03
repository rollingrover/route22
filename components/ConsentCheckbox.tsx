"use client";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("Consent");
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
        {t.rich("text", {
          purpose,
          link: (chunks) => (
            <a href="/privacy" target="_blank" className="font-semibold text-clay underline">
              {chunks}
            </a>
          ),
        })}
      </span>
    </label>
  );
}
