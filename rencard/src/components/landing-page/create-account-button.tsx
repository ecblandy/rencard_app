"use client";

import { usePathname, useRouter } from "next/navigation";
import Button from "../ui/button";

export function CreateAccountButton() {
  const pathname = usePathname();
  const router = useRouter();

  function handleClick() {
    if (pathname === "/") {
      document.getElementById("plans")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.history.replaceState(null, "", "/#plans");

      return;
    }

    router.push("/#plans");
  }

  return (
    <Button
      sizeH="sm"
      variant="default"
      className="w-25.25"
      onClick={handleClick}
    >
      Cadastrar
    </Button>
  );
}
