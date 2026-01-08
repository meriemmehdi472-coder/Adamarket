"use client";

import { CldImage } from "next-cloudinary";

export default function ProductImage({
  publicId,
  alt,
}: {
  publicId: string
  alt: string
}) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border">
      <CldImage
        src={publicId}
        width="900"
        height="900"
        alt={alt}
        className="h-80 w-full object-cover"
      />
    </div>
  );
}
