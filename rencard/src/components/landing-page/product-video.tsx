"use client";

import { motion } from "framer-motion";
import SectionHeader from "./section-header";

export default function ProductVideo() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex justify-center py-[3.75rem] max-sm:py-[2.5rem] px-[1.25rem] bg-[linear-gradient(180deg,#F5F5F5_14.9%,#C2C2C2_94.23%)] h-[51.8125rem]"
    >
      {/* container */}
      <div className="max-w-[56.1875rem] w-full">
        <SectionHeader
          title="Criado para qualquer pessoa que queira se conectar melhor"
          description="Estudantes, profissionais, criadores, freelancers, empreendedores e quem quer compartilhar contato de forma rápida e inteligente"
        />

        <iframe
          loading="lazy"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/hfxc41zCxJs?si=aTLUyWoUf2OIcOWi"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="YouTube video player"
          className="w-full h-[31.5rem] rounded-[1.625rem] mt-[2.5rem]"
        />
      </div>
    </motion.section>
  );
}
