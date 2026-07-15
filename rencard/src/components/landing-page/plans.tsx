"use client";

import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import SectionHeader from "./section-header";
import Button from "../ui/button";

type PlanType = "galera" | "pro";

interface PlanStyle {
  card: string;
  button: string;
  icon: string;
  priceBadge: string;
  priceLabel: string;
  divider: string;
}

interface PlanDetail {
  id: number;
  type: PlanType;
  title: string;
  description: string;
  features: string[];
  buttonTitle: string;
  price: string;
}

const plansDetails: PlanDetail[] = [
  {
    id: 0,
    type: "galera",
    title: "Rencard da Galera",
    description: "Para inciar novas conexões de forma simples e prática.",
    features: [
      "Informações concentradas em um só lugar",
      "Moderno e tecnológico",
      "Suas redes sociais de forma mais interativa (Até 10 redes)",
      "Link personalizado",
      "Música - Sua vibe, em um toque.",
    ],
    buttonTitle: "Escolher Da Galera",
    price: "19,90",
  },
  {
    id: 1,
    type: "pro",
    title: "Rencard Pro",
    description:
      "Para quem quer um ambiente mais profissional e com uma experiência completa.",
    features: [
      "Informações concentradas em um só lugar",
      "Suba suas avaliações no Google",
      "Facilite seu cliente a chegar no seu local",
      "Sem limite de redes sociais",
      "Link personalizado",
      "QR Code digital",
      "Link personalizado para WhatsApp",
      "PIX integrado",
      "Formulário de captação de leads",
      "Métricas Avançadas",
      "Música - Conecte e converta",
    ],
    buttonTitle: "Escolher Pro",
    price: "39,90",
  },
];

const plansStyle: Record<PlanType, PlanStyle> = {
  galera: {
    card: "bg-[#FBFBFB] text-neutral-strong",
    button: "bg-black text-white hover:bg-[#333333]",
    icon: "text-black",
    priceBadge: "bg-black text-white",
    priceLabel: "text-neutral-500",
    divider: "border-neutral-200",
  },
  pro: {
    card: "bg-black text-white",
    button: "bg-white text-black hover:bg-[#E5E5E5]",
    icon: "text-white",
    priceBadge: "bg-white text-black",
    priceLabel: "text-neutral-400",
    divider: "border-neutral-700",
  },
};
function setPlanStyle(planType: string) {
  window.location.href = `https://rencard.com.br/app/onboarding/products?plan=${planType}`;
}
export default function Plans() {
  return (
    <section
      id="plans"
      className="flex flex-col items-center gap-[2.5rem] py-[3.75rem] px-[1.25rem] bg-gradient-to-t from-[#FBFBFB] to-[#C2C2C2]"
    >
      <SectionHeader
        description="O Rencard se adapta ao seu estilo"
        title="Escolha o modelo que mais combina com você"
      />
      <div className="flex justify-center flex-wrap w-full gap-[6rem] items-start">
        {plansDetails.map(
          (
            { id, title, description, features, type, buttonTitle, price },
            index,
          ) => {
            const style = plansStyle[type];
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className={`font-urbanist max-w-[28.75rem] w-full h-auto p-6 rounded-[.625rem] ${style.card}`}
              >
                {/* Cabeçalho com título e preço lado a lado */}
                <div className="flex items-start justify-between gap-4 mb-[2.375rem]">
                  <div className="max-w-[21.25rem] w-full">
                    <h3 className="font-bold text-[2rem]">{title}</h3>
                    <p className="font-semibold text-[1.25rem]">
                      {description}
                    </p>
                  </div>

                  {/* Badge de preço */}
                  <div
                    className={`flex flex-col items-center justify-center rounded-xl px-4 py-3 min-w-[7rem] text-center shrink-0 ${style.priceBadge}`}
                  >
                    <span
                      className={`text-[0.65rem] font-semibold uppercase tracking-widest mb-0.5 ${style.priceLabel}`}
                    >
                      por mês
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[0.85rem] font-bold leading-none">
                        R$
                      </span>
                      <span className="text-[1.6rem] font-extrabold leading-none">
                        {price}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className={`border-t mb-[2rem] ${style.divider}`} />

                <ul className="space-y-[2rem]">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheck size={20} className={style.icon} />
                      <p>{feature}</p>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="custom"
                  sizeH="sm"
                  onClick={() => setPlanStyle(type)}
                  className={`${style.button} mt-[2.5rem] w-full`}
                >
                  {buttonTitle}
                </Button>
              </motion.div>
            );
          },
        )}
      </div>
    </section>
  );
}
