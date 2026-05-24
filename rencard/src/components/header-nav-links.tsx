"use client";
import clsx from "clsx";
import { usePathname } from "next/navigation";
const navLinks = [
  {
    label: "Produtos",
    href: "/#products",
  },

  {
    label: "Planos",
    href: "/#plans",
  },

  {
    label: "Recursos",
    href: "/#resources",
  },
];

export default function HeaderNavLinks() {
  const pathname = usePathname();

  const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];

  const isAuth = AUTH_ROUTES.includes(pathname);
  return (
    <nav
      aria-label="Navegação Principal"
      className={clsx("max-lg:hidden", isAuth ? "hidden" : "")}
    >
      <ul className="flex max-sm:hidden gap-24.75 font-manrope text-black">
        {navLinks.map((link) => {
          const isActiveLink = pathname === link.href;
          const activeClass = isActiveLink ? "border-b-red-600" : "";
          return (
            <li
              key={link.href}
              className={`border-b-2 border-transparent hover:border-b-black transition-all duration-200 ease-in-out ${activeClass}`}
            >
              <a href={link.href} className="font-medium">
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
