// Site-wide settings that are not content data.
//
// Set NEXT_PUBLIC_CONTACT_EMAIL (for example in the Amplify environment
// variables, or in a local .env.local file) to the address people should write
// to. It is deliberately not hard-coded: this repository is public.
export const CONTACT_EMAIL = (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim();

export const LEGAL_UPDATED = "20 November 2026";
