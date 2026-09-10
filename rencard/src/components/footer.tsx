import Image from "next/image";
import Link from "next/link";

const publicLinks = [
  { name: "Política de Privacidade", href: "/privacy-policy" },
  { name: "Termos de Uso", href: "/terms-of-use" },
  { name: "Termos de Serviço", href: "/terms-of-service" },
  { name: "Política de Troca e Devolução", href: "/return-policy" },
];

export default function Footer() {
  return (
    <footer className="flex min-h-[27.4375rem] h-auto flex-col bg-[#454545] px-[3.625rem] py-[2.375rem] max-sm:p-[1.25rem]">
      <div className="flex flex-wrap justify-between gap-[2.5rem]">
        <div className="space-y-[1.5rem]">
          <Image
            src="/images/rencard-logo-footer.svg"
            alt="Rencard"
            width={100}
            height={100}
          />

          <p className="font-manrope font-semibold text-white">
            O cartão de visita do futuro.
          </p>

          <div className="space-y-3">
            <p className="max-w-[18rem] font-manrope text-sm leading-relaxed text-white/80">
              Faça parte da Rencard e transforme conexões em novas
              oportunidades.
            </p>

            <a
              href="mailto:afiliadosuporte@rencard.com.br?subject=Quero%20ser%20afiliado%20Rencard"
              className="group relative inline-flex overflow-hidden rounded-[.625rem] border border-white bg-white px-5 py-2.5 font-manrope font-semibold text-[#454545] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,255,255,0.18)] active:translate-y-0"
            >
              <span className="absolute inset-0 -translate-x-full bg-[#e9e9e9] transition-transform duration-500 ease-out group-hover:translate-x-0" />

              <span className="relative z-10 transition-transform duration-300 group-hover:scale-[1.02]">
                Quero ser afiliado
              </span>
            </a>
          </div>
        </div>

        <div className="space-y-[1rem] font-manrope text-white">
          <p className="font-semibold">Geral</p>

          <ul className="space-y-[1rem]">
            {publicLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:underline">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-[1.5rem] font-manrope text-white">
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

      <div className="mt-7 flex items-center justify-center gap-4 border-t border-[#C2C2C2] pt-[1.5rem] sm:flex-row sm:gap-9">
        <span className="text-center text-white sm:text-left">
          &copy; 2025 Rencard. Todos os direitos reservados.
        </span>

        <div className="flex items-center gap-2">
          <span className="font-medium text-white">Desenvolvido por</span>

          <a
            href="https://codelab.services"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
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
              className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-1 text-xs font-medium text-dark-blue opacity-0 transition-opacity group-hover:opacity-100"
            >
              Ir para o site da Codelab
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
