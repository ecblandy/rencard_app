"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "./section-header";
import { ChevronUp, ChevronDown } from "lucide-react";

const faqDetails = [
  {
    title: "Qual o prazo de entrega?",
    description:
      "O prazo de entrega é de 10 a 15 dias úteis após a postagem dos produtos, podendo haver variações dependendo da região de destino.",
  },
  {
    title: "Como funciona a tecnologia do Rencard?",
    description:
      "O Rencard utiliza a tecnologia NFC (Comunicação por Campo de Proximidade), a mesma usada para pagamentos por aproximação. Basta aproximar o cartão ou a tag da parte traseira do celular para compartilhar seu perfil instantaneamente. Essa tecnologia está presente na grande maioria dos smartphones atuais e é a tendência para o futuro.",
  },
  {
    title:
      "E se a pessoa com quem eu for trocar contatos não tiver NFC no celular?",
    description:
      "Não se preocupe! Todo cartão Rencard possui um QR Code único. A pessoa pode escaneá-lo com a câmera do celular para acessar seu perfil na hora. Além disso, você recebe um link personalizado (ex: seunome.rencard.com) para usar na sua bio do Instagram, em assinaturas de e-mail ou para compartilhar diretamente no WhatsApp. Você sempre terá múltiplas formas de compartilhar sua identidade digital.",
  },
  {
    title: "Qual modelo devo escolher: Da Galera ou Pro?",
    description: `
A escolha depende do seu objetivo:

Escolha o Rencard Da Galera se você quer um perfil social prático, para compartilhar suas redes sociais, PIX e música de forma rápida e descontraída com amigos e novos contatos.

Escolha o Rencard Pro se você é um profissional, empreendedor ou criador de conteúdo. Este modelo oferece uma experiência completa com ferramentas para destacar seu trabalho: você pode adicionar portfólio em vídeo, ver métricas de acesso, integrar ferramentas de marketing e personalizar totalmente o perfil com sua marca. É a solução perfeita para quem não tem um site ou quer complementá-lo com uma vitrine dinâmica.
`,
  },
  {
    title:
      "Qual a diferença entre um cartão de visita tradicional e o Rencard Digital?",
    description: `É a diferença entre o estático e o dinâmico, entre o limitado e o ilimitado.

Cartão de Papel Tradicional	Rencard Digital
Informações fixas e desatualizáveis	Informações editáveis a qualquer momento
Custo recorrente para novas tiragens	Sem custos de reimpressão
Descartável e pouco sustentável	Moderno, tecnológico e reutilizável
Limita a quantidade que você carrega	Ilimitado – um só cartão para sempre
Apenas texto e logo estáticos	Adicione vídeos, portfólio, links de produtos, música e muito mais
Sem interação ou engajamento	Converte um contato em uma experiência para seu cliente
Dificulta a ação do cliente	Oferece atalhos diretos para WhatsApp, PIX, agendamento e redes`,
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="flex flex-col items-center px-[1.25rem] py-[3.75rem] bg-white">
      <SectionHeader
        title="Perguntas frequentes"
        description="Tire suas dúvidas sobre o Rencard."
      />

      <ul className="flex flex-col items-center gap-[1rem] mt-[2.5rem] w-full">
        {faqDetails.map(({ title, description }, index) => {
          const isOpen = openIndex === index;
          return (
            <li
              key={index}
              className="max-w-[56.125rem] w-full min-h-[3.5rem] h-auto rounded-[.625rem] border border-[#C2C2C2] py-[1rem] px-6 cursor-pointer"
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <div className="flex justify-between items-center">
                <span className="font-urbanist font-semibold text-[1.25rem]">
                  {title}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </motion.div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.p
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="font-manrope mt-4 whitespace-pre-line overflow-hidden"
                  >
                    {description}
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
