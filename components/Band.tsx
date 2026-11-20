import type { ReactNode } from "react";

// Full-width coloured band with a centred content column. This is the basic
// "section" building block that lets a page break out of the main column.
export default function Band({
  tone = "soft",
  children,
  id,
  label,
  align = "left",
}: {
  tone?: "soft" | "dark" | "brand";
  children: ReactNode;
  id?: string;
  label?: string;
  align?: "left" | "center";
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`bandx full t-${tone}${align === "center" ? " ctr" : ""}`}
    >
      <div className="bandx-in">{children}</div>
    </section>
  );
}
