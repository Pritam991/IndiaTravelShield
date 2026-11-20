"use client";

import { useState, type ReactNode } from "react";

type Opt = { slug: string; name: string; permit: string | null };

// Server-rendered official links are passed in as nodes so this client
// component stays free of data imports.
export default function RequirementsChecker({
  options,
  visaLink,
  advisoryLinks,
  boiLink,
  mhaLink,
}: {
  options: Opt[];
  visaLink: ReactNode;
  advisoryLinks: ReactNode;
  boiLink: ReactNode;
  mhaLink: ReactNode;
}) {
  const [dest, setDest] = useState(options[0]?.slug ?? "");
  const [nat, setNat] = useState("");
  const [shown, setShown] = useState(false);
  const chosen = options.find((o) => o.slug === dest);

  return (
    <>
      <label>
        Destination
        <select value={dest} onChange={(e) => setDest(e.target.value)}>
          {options.map((o) => (
            <option key={o.slug} value={o.slug}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Your nationality
        <input
          placeholder="e.g. Germany"
          value={nat}
          onChange={(e) => setNat(e.target.value)}
        />
      </label>
      <button className="btn" onClick={() => setShown(true)}>
        Show checklist
      </button>
      {shown && (
        <div>
          <h2>Your checklist</h2>
          <ol>
            <li>
              Passport valid for the period required by the Indian visa rules
              (check the official portal).
            </li>
            <li>
              Visa or e-Visa for {nat.trim() || "your nationality"}: confirm
              eligibility and fees on {visaLink}.
            </li>
            <li>
              {chosen?.permit
                ? `Special permit note: ${chosen.permit}`
                : "No special area permit is recorded in our data for this destination. Verify with the official source."}
            </li>
            <li>Travel insurance covering medical care and evacuation.</li>
            <li>Read your government&apos;s advisory: {advisoryLinks}.</li>
          </ol>
          <p className="small">
            Immigration rules: {boiLink}. Restricted areas: {mhaLink}.
          </p>
        </div>
      )}
    </>
  );
}
