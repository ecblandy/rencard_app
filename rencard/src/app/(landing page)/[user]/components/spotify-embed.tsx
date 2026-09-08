"use client";

import { useState } from "react";

type Props = {
  url: string;
};

export default function SpotifyEmbed({ url }: Props) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative my-8 h-[152px] w-full overflow-hidden rounded-xl">
      {loading && (
        <div className="absolute inset-0 animate-pulse rounded-xl bg-neutral-200" />
      )}

      <iframe
        src={url}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        onLoad={() => setLoading(false)}
        className={`h-[152px] w-full rounded-xl transition-opacity duration-200 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
