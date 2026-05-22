import Image from "next/image";
import Link from "next/link";

const publicLinks = [
  { name: "Política de Privacidade", href: "#" },
  { name: "Política de devolução", href: "#" },
  { name: "LGPD", href: "#" },
  { name: "Política comercial", href: "#" },
  { name: "Política de assinatura", href: "#" },
  { name: "Termos de serviço", href: "#" },
  { name: "Seja um(a) afiliado(a) Rencard", href: "#" },
];

export default function Footer() {
  return (
    <footer className="flex flex-col  bg-[#454545] min-h-[27.4375rem] h-auto px-[3.625rem] py-[2.375rem] ">
      <div className="flex flex-wrap justify-between gap-[2.5rem]">
        <div className="space-y-[1.5rem]">
          <Image
            src="/images/rencard-logo-footer.svg"
            alt="Footer Logo"
            width={100}
            height={100}
          />
          <p className="font-manrope font-semibold text-white">
            O cartão de visita do futuro.
          </p>
        </div>

        <div className="font-manrope text-white space-y-[1rem]">
          <p className="font-semibold">Geral</p>
          <ul className="space-y-[1rem] ">
            {publicLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="hover:underline">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="font-manrope space-y-[1.5rem] text-white">
          <p className="font-semibold">Contato</p>
          <address className="space-y-[.375rem] not-italic">
            <p className="font-semibold">Ajuda e Parcerias</p>
            <Link
              href="mailto:suporte@rencard.com.br"
              className="hover:underline"
            >
              suporte@rencard.com.br
            </Link>
          </address>
        </div>
      </div>

      <div className="flex flex-col border-t border-[#C2C2C2] pt-[1.5rem] sm:flex-row items-center gap-4 sm:gap-9 justify-center mt-7">
        <span className="text-white text-center sm:text-left">
          &copy; 2025 Rencard. Todos os direitos reservados.
        </span>

        <div className="flex items-center gap-2">
          <span className="font-medium text-white">Desenvolvido por</span>
          <a
            href="https://codelab.services"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group"
            aria-label="Ir para o site da Codelab"
          >
            <Image
              src="/images/codelab-logo.svg"
              alt="Codelab"
              width={100}
              height={24}
              className="object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span
              role="tooltip"
              className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-dark-blue text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              Ir para o site da Codelab
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
