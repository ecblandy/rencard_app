"use client";

import Image from "next/image";
import { motion, Variants, Transition } from "framer-motion";
import Button from "../ui/button";

const transition: Transition = {
  duration: 0.6,
  ease: "easeOut",
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition,
  },
};

export default function Hero() {
  return (
    <section className="relative flex items-center min-h-[39.25rem] md:min-h-[39.25rem] max-sm:min-h-[37.125rem] overflow-hidden">
      <Image
        src="/images/hero-image.png"
        alt="Hero do Rencard"
        fill
        priority
        fetchPriority="high"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAECAIAAAA4WjmaAAAAiElEQVR4AQB8AIP/Al9kZmxxc2ZrbGVqa3F2dnR4eXd8fIGGhnp+f0dJTAIUEhIOCwoTEBARDw8LCAgNCgkFAgDY1NHh39z19PQCDAoKCAYHCQcICwkJBAMEExMTDQwL1d"
        className="object-cover object-center"
      />

      {/* Overlay para melhorar a leitura do conteúdo */}
      <div
        className="
          absolute inset-0 z-[1]
          bg-white/50
          md:bg-white/35
        "
      />

      <motion.div
        className="
          relative z-10
          font-urbanist
          w-full
          px-6
          sm:px-10
          md:pl-[5rem]
          md:pr-0
        "
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Título */}
        <motion.h1
          className="
            font-bold
            text-[#454545]
            text-[2rem]
            sm:text-[2.75rem]
            md:text-[4rem]
            leading-[110%]
            md:leading-[100%]
            mb-4
            md:mb-[1.5rem]
            max-w-[51.875rem]
            w-full
          "
          variants={itemVariants}
        >
          Olá, eu sou o{" "}
          <strong
            className="
              font-montserrat
              font-extrabold
              text-white
              tracking-[-0.04em]
            "
          >
            RENCARD
          </strong>
          !
          <br />A melhor forma de fazer networking!
        </motion.h1>

        {/* REN */}
        <motion.div
          className="
            flex
            items-center
            bg-[#FBFBFB]/85
            max-w-[37.75rem]
            w-full
            h-[3rem]
            md:h-[3.5rem]
            px-5
            md:px-[1.875rem]
            my-4
            md:my-[1.5rem]
            rounded-[.625rem]
            border
            border-[#454545]/10
          "
          variants={itemVariants}
        >
          <p
            className="
              text-[1.5rem]
              max-sm:text-[1.25rem]
              md:text-[2.5rem]
              text-[#454545]
              font-montserrat
              leading-none
            "
          >
            <strong className="font-extrabold">E você já tem seu</strong>{" "}
            <span className="font-bold">REN?</span>
          </p>
        </motion.div>

        {/* Descrição */}
        <motion.p
          className="
            font-semibold
            text-[1rem]
            sm:text-[1.25rem]
            md:text-[1.5rem]
            text-[#454545]
            max-w-[46.25rem]
            w-full
          "
          variants={itemVariants}
        >
          Troque informações em segundos. NFC, QR Code e um perfil digital
          completo — tudo em um só produto.
        </motion.p>

        {/* Botões */}
        <motion.div
          className="
            flex
            items-center
            gap-4
            md:gap-[1.5rem]
            mt-6
            md:mt-[2.5rem]
          "
          variants={itemVariants}
        >
          <Button
            sizeH="sm"
            variant="default"
            href="/app/auth/signup"
            className="w-[10.75rem] first-letter:uppercase"
          >
            criar meu rencard
          </Button>

          <Button
            sizeH="sm"
            variant="outline"
            onClick={() => {
              document
                .getElementById("plans")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="first-letter:uppercase hover:cursor-pointer"
          >
            ver planos
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
