"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeader from "./section-header";

const productsDetails = [
  {
    imageUrl: "/images/digital-card.svg",
    info: "O clássico premium",
    title: "Cartão Digital",
    description: "Cartão físico com NFC + QR Code integrado",
  },
  {
    imageUrl: "/images/tag-renc.svg",
    info: "Leve e versártil",
    title: "Tag Renc",
    description: "Tag NFC circular que você pode colar no seu celular",
  },
];

export default function Products() {
  return (
    <section id="products" className="py-[3.75rem] bg-black px-[1.25rem]">
      <SectionHeader
        title="Os produtos"
        description="Escolha o formato ideal para o seu estilo"
        texStyle="white"
      />

      <ul className="flex flex-wrap justify-center w-full gap-[7.8125rem] mt-[2.5rem]">
        {productsDetails.map(
          ({ imageUrl, info, title, description }, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: index * 0.2,
                duration: 0.6,
                ease: "easeOut",
              }}
              className="flex flex-col items-center gap-[2.5rem] p-6 font-manrope rounded-[1.25rem] bg-white border border-[#7A7A7A]"
            >
              <div className="relative w-full h-48">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover rounded-[1.25rem]"
                />
              </div>
              <div className="flex flex-col gap-[1rem]">
                <span className="font-medium text-[.875rem] text-neutral-strong">
                  {info}
                </span>
                <h3 className="font-urbanist font-semibold text-[1.5rem]">
                  {title}
                </h3>
                <p className="text-neutral-strong max-w-[18.75rem] w-full">
                  {description}
                </p>
              </div>
            </motion.li>
          )
        )}
      </ul>
    </section>
  );
}
