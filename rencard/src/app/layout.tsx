import type { Metadata } from "next";
import "./globals.css";
import { manrope, montserrat, urbainst } from "../../public/fonts";

export const metadata: Metadata = {
  title: "Rencard – Seu link, seus produtos e serviços",
  icons: {
    icon: "/images/favicon.png",
  },
  description:
    "Rencard é uma plataforma para centralizar seus links, produtos e serviços, incluindo RencardPro, RencTag e o Cartão Rencard. Organize tudo em um único lugar de forma prática e profissional.",
  keywords: [
    "Rencard",
    "RencardPro",
    "RencTag",
    "Cartão Rencard",
    "Linktree",
    "Links",
    "Produtos",
    "Serviços",
  ],
  authors: [{ name: "Rencard", url: "https://rencard.com.br" }],
  openGraph: {
    title: "Rencard – Seu link, seus produtos e serviços",
    description:
      "Organize seus links, produtos e serviços em um só lugar com Rencard. Conheça RencardPro, RencTag e o Cartão Rencard.",
    url: "https://rencard.com.br",
    siteName: "Rencard",
    images: [
      {
        url: "https://rencard.com.br/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rencard - Organize seus links e produtos",
      },
    ],
    locale: "pt-BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rencard – Seu link, seus produtos e serviços",
    description:
      "Organize seus links, produtos e serviços em um só lugar com Rencard. Conheça RencardPro, RencTag e o Cartão Rencard.",
    images: ["https://rencard.com.br/images/og-image.png"],
  },
};

// A ROTA DO PERFIL DO USUARIO
// recard.com/nacif
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${manrope.variable} ${montserrat.variable} ${urbainst.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
