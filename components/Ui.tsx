import type { ReactNode } from "react";
import { sources } from "@/lib/data";
import type { ImageCredit } from "@/lib/images";

export function SourceLink({ id }: { id: string }) {
  const s = sources[id];
  if (!s) return null;
  return (
    <a href={s.url} rel="noopener noreferrer" target="_blank">
      {s.name}
    </a>
  );
}

export function SourceList({ ids }: { ids: string[] }) {
  return (
    <ul>
      {ids.map((id) => (
        <li key={id}>
          <SourceLink id={id} />
        </li>
      ))}
    </ul>
  );
}

// Used wherever we have no verified, sourced figure. We never estimate.
export function Pending({ label }: { label: string }) {
  return (
    <p className="pending">
      <strong>{label}:</strong> data not yet loaded. We only publish figures
      that come from an official source with a year attached.
    </p>
  );
}

// Full photo credit, placed directly under the image it describes.
export function PhotoCredit({ img }: { img: ImageCredit }) {
  return (
    <figcaption className="credit">
      Photo: &ldquo;{img.title.replace(/\.\w+$/, "")}&rdquo; by {img.author},{" "}
      {img.license} &middot;{" "}
      <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer">
        Wikimedia Commons
      </a>
    </figcaption>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="bul">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

// Marks text that is editorial guidance rather than a sourced figure.
export function EditorialNote({ text }: { text: string }) {
  return (
    <p className="edit-note">
      <strong>Editorial guidance.</strong> {text}
    </p>
  );
}

// Accessible accordion item (native <details>, no JS needed).
export function Disclosure({
  title,
  children,
  open = false,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="dis" open={open}>
      <summary>{title}</summary>
      <div className="dis-body">{children}</div>
    </details>
  );
}
