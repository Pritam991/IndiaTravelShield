import type { ReactNode } from "react";

// Full-width title band used at the top of list and information pages, so
// they open the same way as the photo heroes do.
export default function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  crumbs?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="pghead full">
      <div className="pghead-in">
        {crumbs && <nav className="crumb on-dark">{crumbs}</nav>}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
