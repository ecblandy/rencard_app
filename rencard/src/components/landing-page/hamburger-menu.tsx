"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Button from "../ui/button";
import clsx from "clsx";

const navLinks = [
  { label: "Produtos", href: "#products" },
  { label: "Planos", href: "#plans" },
  { label: "Recursos", href: "#resources" },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];
  const isAuth = AUTH_ROUTES.includes(pathname);

  if (isAuth) return null;

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir menu"
        className="flex items-center justify-center p-2 rounded-md text-black"
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-[75vw] max-w-[20rem] bg-white shadow-2xl flex flex-col px-6 py-8 gap-8"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <nav aria-label="Menu mobile">
                <ul className="flex flex-col gap-6 font-manrope text-black">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={clsx(
                            "font-medium text-lg border-b-2 pb-1 transition-all duration-200",
                            isActive
                              ? "border-red-600"
                              : "border-transparent hover:border-black",
                          )}
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="h-px w-full bg-neutral-200" />

              <div className="flex flex-col gap-3">
                <a href="/app/auth/signin" onClick={() => setOpen(false)}>
                  <Button
                    sizeH="sm"
                    variant="custom"
                    className="w-full hover:bg-black hover:text-white"
                  >
                    Entrar
                  </Button>
                </a>
                <a href="/app/auth/signup" onClick={() => setOpen(false)}>
                  <Button sizeH="sm" variant="default" className="w-full">
                    Cadastrar
                  </Button>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
