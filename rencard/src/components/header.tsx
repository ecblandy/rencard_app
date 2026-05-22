"use client";
import Image from "next/image";
import HeaderNavLinks from "./header-nav-links";
import HeaderAuthButtons from "./header-auth-buttons";

import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-5 min-h-[5.125rem] w-full bg-[#FBFBFB66] border-b border-neutral-extra-soft">
      <Link href="/">
        {" "}
        <Image
          src="/images/rencard-logo.svg"
          alt="Rencard Logo"
          width={145}
          height={36}
        />
      </Link>
      <HeaderNavLinks  />
      <HeaderAuthButtons />
    </header>
  );
}
