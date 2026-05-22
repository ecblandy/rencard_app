"use client";

import Image from "next/image";
import { Crown, PackageIcon, Settings } from "lucide-react";
import { WiStars } from "react-icons/wi";
import { motion } from "framer-motion";
import SectionHeader from "./section-header";

interface StepByStepDetails {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  step: string;
  title: string;
  description: React.ReactNode;
  describer?: string;
  footerText: string;
}

const stepsDetails: StepByStepDetails[] = [
  {
    icon: PackageIcon,
    step: "01",
    title: "Escolha seu Rencard",
    description:
      "Primeiro, escolha o estilo ideal para você. Depois, selecione o formato ideal.",
    describer: "Tag Renc, Cartão de Visita Físico ou Rencard Digital.",
    footerText: "Você pode combinar produtos conforme sua necessidade.",
  },
  {
    icon: Settings,
    step: "02",
    title: "Configure com liberdade",
    description:
      "Ao adquirir seu produto, você recebe acesso completo ao plano correspondente.  Durante esse período, você pode personalizar o perfil.",
    describer: "1 mês de acesso liberado!",
    footerText:
      "Use esse tempo para deixar seu perfil exatamente do seu jeito.",
  },
  {
    icon: Crown,
    step: "03",
    title: "Após 1 mês, escolha como continuar",
    description: (
      <>
        Permanecer no Plano Free (Vitalício)
        <br />
        ou
        <br />
        Assinar o Plano Pago (Recomendado)
      </>
    ),
    footerText: "Mantenha sua identidade digital sempre atual e poderosa.",
  },
];

export default function StepByStep() {
  return (
    <section className="relative flex flex-col max-sm:px-[1.25rem] px-[5.625rem] py-[3.75rem] min-h-[35.1875rem] h-auto">
      <Image
        src="/images/texture-works-section.png"
        alt="Hero do Rencard"
        fill
        priority
        fetchPriority="high"
        className="object-cover"
      />

      <div className="relative z-10">
        <SectionHeader
          title="Como funciona"
          description="Uma jornada simples e transparente, do produto ao perfil digital"
        />

        <div className="mt-[2.5rem]">
          <ul className="flex items-center flex-wrap justify-center gap-[3.6875rem]">
            {stepsDetails.map(
              (
                { step, icon: Icon, title, description, describer, footerText },
                index
              ) => (
                <motion.li
                  key={step}
                  initial={{ opacity: 0, y: 30 }} // começa invisível e um pouco abaixo
                  whileInView={{ opacity: 1, y: 0 }} // anima para visível quando entra na tela
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }} // animação em sequência
                  className="space-y-[1rem] text-center font-manrope bg-[#F5F5F5] p-[1rem] max-w-[23.875rem] w-full min-h-[19.6875rem] h-auto rounded-[.625rem] shadow-[0px_1px_3px_1px_#00000026,_0px_1px_2px_0px_#0000004D]"
                >
                  {/* Step number and icon */}
                  <div className="flex items-center gap-[8px]">
                    <span className="flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-[1rem] bg-black text-white">
                      <Icon />
                    </span>
                    <span className="font-urbanist font-bold text-[1.875rem] text-neutral-strong">
                      {step}
                    </span>
                  </div>

                  {/* Step title, description and describer */}
                  <div className="space-y-[1rem]">
                    <h3 className="font-urbanist text-black font-semibold text-[1.5rem]">
                      {title}
                    </h3>
                    <p className="">{description}</p>
                    {describer && <p className="font-semibold">{describer}</p>}
                  </div>

                  {/* Footer text */}
                  <div className="flex items-center border border-[#C2C2C2] w-full h-auto py-[.5rem] px-[1.3125rem] rounded-[.625rem]">
                    <WiStars size={40} />
                    <p className="px-[.25rem]">{footerText}</p>
                  </div>
                </motion.li>
              )
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
