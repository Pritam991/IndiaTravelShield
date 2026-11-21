// Google AdSense settings and the rule for which pages may carry ads.
//
// Why a page allow-list: Google's publisher policies ban ads on screens that
// lack publisher content, are "under construction", are navigation or list
// pages, or hold less content than ads. So the ad script loads only on pages
// that are full guides. Everything else (home, indexes, the 27 state pages
// that have no guides yet, the short place pages, About, Contact, Privacy) is
// left out. To allow a page, add its path pattern below.
//
// Rules the code cannot enforce, which the site owner must follow:
//   - never click your own ads, and never ask anyone else to;
//   - never put an ad where it could be mistaken for a menu or a download
//     link, or next to the sticky header, back-to-top button or consent banner;
//   - never label an ad with anything but "Advertisement" or "Sponsored".
export const ADSENSE_CLIENT = "ca-pub-2502630111748192";
export const ADSENSE_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

const ELIGIBLE: RegExp[] = [
  /^\/destinations\/[^/]+\/?$/, // full destination guides (about 1,700 words each)
  /^\/insights\/?$/, //            the data analysis page
  /^\/requirements\/?$/, //        the documents and permits guide
];

export const adsEligible = (pathname: string) => ELIGIBLE.some((r) => r.test(pathname));
