import Image from "next/image";

export function AvatarImage({
  src,
  alt = "",
  className,
  size = 96,
  priority = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src={src || "/next.svg"}
      alt={alt}
      width={size}
      height={size}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}
