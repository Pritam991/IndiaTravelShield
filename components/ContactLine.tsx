"use client";

import { useState } from "react";
import { CONTACT_PARTS } from "@/lib/site";

const decode = (s: string) =>
  [...atob(s)].reverse().join("");

// Shows a button instead of the address. The address is assembled in the
// browser only after a click, so it is never present in the server-rendered
// HTML that simple scrapers read. Deterrent only: a person (or a full browser
// bot) can still reveal it.
export default function ContactLine({ subject }: { subject?: string }) {
  const [email, setEmail] = useState<string | null>(null);

  if (!email) {
    return (
      <button
        type="button"
        className="reveal-email"
        onClick={() => setEmail(`${decode(CONTACT_PARTS[0])}@${decode(CONTACT_PARTS[1])}`)}
      >
        Show email address
      </button>
    );
  }

  const href = `mailto:${email}${
    subject ? `?subject=${encodeURIComponent(subject)}` : ""
  }`;
  return <a href={href}>{email}</a>;
}
