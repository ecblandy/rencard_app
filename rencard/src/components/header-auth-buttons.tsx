"use client";

import Link from "next/link";
// Components
import Button from "./ui/button";
import { CreateAccountButton } from "./landing-page/create-account-button";

export default function HeaderAuthButtons() {
  return (
    <div className="flex max-sm:hidden items-center gap-2.5">
      <Link href="/app/auth/signin">
        <Button
          sizeH="sm"
          variant="custom"
          className="w-[4.9375rem] hover:bg-black hover:text-white"
        >
          Entrar
        </Button>
      </Link>

      <CreateAccountButton />
    </div>
  );
}
