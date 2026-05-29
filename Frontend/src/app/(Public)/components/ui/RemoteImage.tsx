"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type RemoteImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

const isExternalUrl = (src: string) =>
  src.startsWith("http://") || src.startsWith("https://");

export default function RemoteImage({
  src,
  alt,
  fallbackSrc = "/assets/img/about.webp",
  className,
  fill,
  width,
  height,
  priority,
  sizes,
  style,
}: RemoteImageProps) {
  const [failed, setFailed] = useState(false);

  const resolvedSrc = src && src.trim().length > 0 ? src : fallbackSrc;
  const useNative = failed || !isExternalUrl(resolvedSrc);

  if (useNative) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={alt}
          className={className}
          style={{ ...style, objectFit: "cover", width: "100%", height: "100%" }}
          onError={() => setFailed(true)}
          loading={priority ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt={alt}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        className={className}
        style={style}
        onError={() => setFailed(true)}
        loading={priority ? "eager" : "lazy"}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      style={style}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
