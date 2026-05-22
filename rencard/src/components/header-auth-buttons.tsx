"use client";
// Components
import Button from "./ui/button";

export default function HeaderAuthButtons() {
  return (
    <div className="flex max-sm:hidden items-center gap-2.5">
      <a href="/app/auth/signin">
        <Button
          sizeH="sm"
          variant="custom"
          className="w-[4.9375rem] hover:bg-black hover:text-white"
        >
          Entrar
        </Button>
      </a>
      <a href="/app/auth/signup">
        <Button sizeH="sm" variant="default" className="w-25.25">
          Cadastrar
        </Button>
      </a>
    </div>
  );
}
