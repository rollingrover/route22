"use client";

import { useState } from "react";

type Props = {
  url: string;
  title: string;
  summary?: string;
};

// Small round icon buttons using site tokens (bush/clay). No third-party
// tracking scripts — these are plain share-intent links plus a copy-to-clipboard.
export default function ShareButtons({ url, title, summary }: Props) {
  const [copied, setCopied] = useState(false);

  const text = summary ? `${title} — ${summary}` : title;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const links: { label: string; href: string; svgPath: string }[] = [
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      svgPath:
        "M13.5 9H15V6.5h-1.5C11.6 6.5 10.5 7.6 10.5 9v2H9v2.5h1.5V19H13v-5.5h1.8l.3-2.5H13V9c0-.28.22-.5.5-.5z",
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      svgPath:
        "M6 5l5.2 6.9L6.1 19H7.7l4.5-5.1L15.7 19H19l-5.5-7.3L18.2 5h-1.6l-4.1 4.7L9 5H6zm2.3 1.2h1.5l7.6 10.6h-1.5L8.3 6.2z",
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      svgPath:
        "M12 5a7 7 0 0 0-6 10.6L5 19l3.5-1a7 7 0 1 0 3.5-13zm0 1.5a5.5 5.5 0 0 1 4.5 8.6l.3.9-1 .3a5.5 5.5 0 0 1-8.4-4.7A5.5 5.5 0 0 1 12 6.5zm-2.4 2.6c-.2 0-.4.1-.5.4-.2.3-.6.7-.6 1.6s.6 1.8.7 1.9c.1.1 1.4 2.2 3.4 2.9 1.7.6 2 .5 2.3.4.4 0 1.1-.4 1.3-.9.1-.4.1-.8.1-.9 0-.1-.1-.1-.3-.2l-1.4-.7c-.2-.1-.3-.1-.5.1l-.5.7c-.1.1-.2.2-.4.1a4.5 4.5 0 0 1-1.4-.9 5 5 0 0 1-.9-1.2c-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.3.1-.4l-.6-1.5c-.1-.4-.3-.3-.5-.3h-.4z",
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      svgPath:
        "M6.9 8.5H4.4V19h2.5V8.5zM5.6 4.9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM19.5 19h-2.5v-5.4c0-1.3-.5-2.1-1.6-2.1-.9 0-1.5.6-1.7 1.2-.1.2-.1.5-.1.8V19H11s.03-9.8 0-10.5h2.6v1.5c.3-.5 1-1.2 2.4-1.2 1.8 0 3.5 1.2 3.5 3.7V19z",
    },
    {
      label: "Share by email",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%20${encodedUrl}`,
      svgPath:
        "M4 6.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm.6 1.5 7.4 5.4 7.4-5.4",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Share this page">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          title={l.label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-bush transition hover:border-clay hover:bg-clay hover:text-white focus:outline focus:outline-2 focus:outline-clay"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d={l.svgPath} fill="currentColor" stroke="none" />
          </svg>
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link to this page"
        title="Copy link"
        className="flex h-9 items-center gap-1.5 rounded-full border border-line bg-paper px-3 text-[0.8rem] font-semibold text-bush transition hover:border-clay hover:bg-clay hover:text-white focus:outline focus:outline-2 focus:outline-clay"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V6a2 2 0 0 1 2-2h9" />
        </svg>
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
