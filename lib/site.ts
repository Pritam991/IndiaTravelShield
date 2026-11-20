// Site-wide settings that are not content data.
//
// The contact address is NOT stored as plain text anywhere in this repository
// or in the page HTML. It is kept in two reversed, encoded parts and only
// assembled in the visitor's browser when they click "Show email address", so
// simple scrapers that read page source or HTML never see it.
//
// This deters automated harvesting only. It is not secrecy: anyone who clicks
// the button, or runs a full browser, can read the address.
//
// To change it, run this in a terminal and paste the two results below:
//   node -e 'const e=process.argv[1],i=e.indexOf("@");
//     const b=s=>Buffer.from([...s].reverse().join("")).toString("base64");
//     console.log(JSON.stringify([b(e.slice(0,i)),b(e.slice(i+1))]))' you@example.com
export const CONTACT_PARTS: [string, string] = [
  "MTAwMnlvamluYW1tYXRpcnA=",
  "bW9jLmxpYW1n",
];

export const LEGAL_UPDATED = "20 November 2026";
