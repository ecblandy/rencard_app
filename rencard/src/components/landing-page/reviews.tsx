"use client";

import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import SectionHeader from "./section-header";

const reviewDetails = [
  {
    description:
      '"Meus clientes ficam impressionados toda vez. Profissionalismo em um toque."',
    clientName: "Marina Costa",
  },
  {
    description:
      '"Parei de distribuir cartões de papel. O Rencard é mais prático e elegante."',
    clientName: "Rafael Santos",
  },
  {
    description:
      '"Em eventos, sou sempre lembrado. O cartão NFC abre conversas instantâneas."',
    clientName: "Juliana Mendes",
  },
] as const;

export default function Reviews() {
  return (
    <section className="px-[1.25rem] py-[3.75rem] bg-[linear-gradient(270deg,#F5F5F5_14.9%,#C2C2C2_94.23%)]">
      <SectionHeader
        title="O que dizem"
        description="Pessoas que já transformaram sua forma de fazer networking"
      />

      <ul className="flex flex-wrap items-center justify-center gap-[4.0625rem] mt-[2.5rem]">
        {reviewDetails.map(({ clientName, description }, index) => (
          <motion.li
            key={clientName}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
            className="max-w-[19.9375rem] w-full h-auto space-y-[1rem] font-manrope py-[1rem] px-6 border border-[#7A7A7A] rounded-[1.25rem]"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-500" />
              ))}
            </div>
            <p>{description}</p>
            <h3 className="font-semibold">{clientName}</h3>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
