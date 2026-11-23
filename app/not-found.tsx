import type { Metadata } from "next";
import Link from "next/link";

// Unknown URLs get a real 404 with useful links, and are kept out of search.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <article className="prose">
      <h1>Page not found</h1>
      <p className="lead">
        We could not find that page. It may have moved, or the address may have a
        typo.
      </p>
      <ul className="bul">
        <li>
          <Link href="/destinations">Browse destinations</Link>
        </li>
        <li>
          <Link href="/states">Browse states and territories</Link>
        </li>
        <li>
          <Link href="/requirements">Check what you need to visit India</Link>
        </li>
        <li>
          <Link href="/">Go to the home page</Link>
        </li>
      </ul>
    </article>
  );
}
