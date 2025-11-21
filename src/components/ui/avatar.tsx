"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** If true, skip Next's optimization (useful for dev or unsupported hosts) */
  unoptimized?: boolean;
}

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
  unoptimized = true, // Default to true for Appwrite URLs
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses: Record<
    NonNullable<AvatarProps["size"]>,
    { container: string; pxSize: number }
  > = {
    sm: { container: "w-8 h-8 text-xs", pxSize: 32 },
    md: { container: "w-10 h-10 text-sm", pxSize: 40 },
    lg: { container: "w-12 h-12 text-base", pxSize: 48 },
    xl: { container: "w-16 h-16 text-lg", pxSize: 64 },
  };

  const { container, pxSize } = sizeClasses[size];

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/60 border-2 border-primary/30 font-semibold text-white",
        container,
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        // parent has position: relative; Image uses fill to cover it
        <Image
          src={src}
          alt={alt ?? "Avatar"}
          // "fill" makes the image fill the parent (parent must be position:relative)
          fill
          sizes={`${pxSize}px`}
          style={{ objectFit: "cover" }}
          onError={() => setImageError(true)}
          unoptimized={unoptimized}
          // optional: priority for LCP-critical avatars
          // priority={true}
        />
      ) : (
        <span className="uppercase">
          {fallback ?? (alt ? alt.charAt(0) : "?")}
        </span>
      )}
    </div>
  );
}
