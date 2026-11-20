import Image from "next/image";

// Photo with a gradient fallback so pages never show a broken or empty box.
export default function Photo({
  src,
  alt,
  name,
  sizes,
  priority = false,
}: {
  src: string | null;
  alt: string;
  name: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div className="ph-fallback" role="img" aria-label={alt}>
        <span>{name.slice(0, 1)}</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      style={{ objectFit: "cover" }}
    />
  );
}
