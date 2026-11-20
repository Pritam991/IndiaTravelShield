import { CONTACT_EMAIL } from "@/lib/site";

// Shows the contact address as a mailto link. When no address has been
// configured yet, says so plainly instead of showing a made-up one.
export default function ContactLine({ subject }: { subject?: string }) {
  if (!CONTACT_EMAIL) {
    return (
      <span className="pending-inline">
        [contact email not configured yet: set NEXT_PUBLIC_CONTACT_EMAIL]
      </span>
    );
  }
  const href = `mailto:${CONTACT_EMAIL}${
    subject ? `?subject=${encodeURIComponent(subject)}` : ""
  }`;
  return <a href={href}>{CONTACT_EMAIL}</a>;
}
