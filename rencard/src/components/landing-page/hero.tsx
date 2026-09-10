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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition,
  },
};

export default function Hero() {
  const handleCreateRencard = () => {
    const plansSection = document.getElementById("plans");

    if (!plansSection) {
      return;
    }

    plansSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative flex min-h-[39.25rem] items-center max-sm:min-h-[37.125rem] md:min-h-[39.25rem]">
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

      <motion.div
        className="relative z-10 w-full px-6 font-urbanist sm:px-10 md:pl-[5rem] md:pr-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mb-4 w-full max-w-[51.875rem] text-[2rem] font-bold leading-[110%] sm:text-[2.75rem] md:mb-[1.5rem] md:text-[4rem] md:leading-[100%]"
          variants={itemVariants}
        >
          Olá, eu sou o{" "}
          <span className="font-normal text-white">
            REN<span className="font-extrabold">CARD</span>
          </span>
          !
          <br />A melhor forma de fazer networking!
        </motion.h1>

        <motion.div
          className="my-4 flex h-[3rem] w-fit max-w-[37.75rem] items-center rounded-[.625rem] bg-[#FBFBFB80] px-5 md:my-[1.5rem] md:h-[3.5rem] md:px-[1.875rem]"
          variants={itemVariants}
        >
          <p className="whitespace-nowrap font-montserrat text-[1.5rem] text-[#454545] max-sm:text-[1.25rem] md:text-[2.5rem]">
            E você já tem seu <strong className="font-extrabold">CARD?</strong>
          </p>
        </motion.div>

        <motion.div
          className="w-full"
          style={{ maxWidth: "clamp(14rem, 40vw, 32rem)" }}
          variants={itemVariants}
        >
          <p className="text-[1rem] font-semibold text-white sm:text-[1.25rem] md:text-[1.5rem]">
            Troque informações em segundos. NFC, QR Code e um perfil digital
            completo — tudo em um só produto.
          </p>
        </motion.div>

        <motion.div
          className="mt-6 flex items-center gap-4 md:mt-[2.5rem]"
          variants={itemVariants}
        >
          <Button
            sizeH="md"
            variant="default"
            onClick={handleCreateRencard}
            className="w-[10.75rem] hover:cursor-pointer"
          >
            Criar meu rencard
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
