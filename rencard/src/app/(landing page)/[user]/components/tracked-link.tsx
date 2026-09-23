"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";

type Props = {
  href: string;
  trackedUrl?: string | null;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  target?: string;
  rel?: string;
};

export default function TrackedLink({
  href,
  trackedUrl,
  children,
  className,
  style,
  target = "_blank",
  rel = "noopener noreferrer",
}: Props) {
  function handleClick(_event: MouseEvent<HTMLAnchorElement>) {
    if (!trackedUrl) {
      return;
    }

    void fetch(trackedUrl, {
      method: "GET",
      keepalive: true,
    }).catch(() => {
      // O tracking nunca deve impedir o acesso ao link.
    });
  }

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
