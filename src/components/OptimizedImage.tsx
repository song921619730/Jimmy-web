import type { ImgHTMLAttributes } from "react";
import type { GeneratedMediaItem } from "../data/generatedMedia";

type OptimizedImageProps = {
  item: GeneratedMediaItem;
  sizes: string;
  includeLarge?: boolean;
  className?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes">;

function imageCandidates(
  item: GeneratedMediaItem,
  format: "avif" | "webp",
  includeLarge: boolean,
) {
  const thumb = format === "avif" ? item.thumbAvif : item.thumb;
  const large = format === "avif" ? item.srcAvif : item.src;
  const candidates = [
    thumb ? `${thumb} ${item.thumbWidth || 720}w` : "",
    includeLarge && large ? `${large} ${item.srcWidth || item.width || 1920}w` : "",
  ].filter(Boolean);

  return Array.from(new Set(candidates)).join(", ");
}

export function OptimizedImage({
  item,
  sizes,
  includeLarge = true,
  className,
  alt,
  loading = "lazy",
  decoding = "async",
  ...imageProps
}: OptimizedImageProps) {
  const avifSrcSet = imageCandidates(item, "avif", includeLarge);
  const webpSrcSet = imageCandidates(item, "webp", includeLarge);
  const fallbackSrc = includeLarge ? item.src || item.thumb : item.thumb || item.src;

  return (
    <picture className={className}>
      {avifSrcSet ? <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} /> : null}
      {webpSrcSet ? <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} /> : null}
      <img
        {...imageProps}
        src={fallbackSrc}
        srcSet={webpSrcSet || undefined}
        sizes={webpSrcSet ? sizes : undefined}
        alt={alt ?? item.alt}
        loading={loading}
        decoding={decoding}
      />
    </picture>
  );
}
