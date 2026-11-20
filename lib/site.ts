// Site-wide settings that are not content data.
//
// The contact address is shown on the Contact, About and Privacy pages, so it
// is public on the live site either way. NEXT_PUBLIC_CONTACT_EMAIL overrides
// the default if you later move to an address on your own domain.
export const CONTACT_EMAIL = (
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "pritammanijoy2001@gmail.com"
).trim();

export const LEGAL_UPDATED = "20 November 2026";
