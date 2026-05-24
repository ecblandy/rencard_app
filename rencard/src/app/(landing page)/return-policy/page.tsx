import { LegalSection } from "@/components/landing-page/terms/legal-section";
import TermsTitle from "@/components/landing-page/terms/terms-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Troca, Devolução e Garantia | Rencard",
  description:
    "Conheça a política de troca, devolução por arrependimento e garantia dos produtos físicos Rencard. Seus direitos garantidos pelo Código de Defesa do Consumidor.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://rencard.com.br/return-policy",
  },
  openGraph: {
    title: "Política de Troca, Devolução e Garantia | Rencard",
    description:
      "Conheça a política de troca, devolução por arrependimento e garantia dos produtos físicos Rencard. Seus direitos garantidos pelo Código de Defesa do Consumidor.",
    url: "https://rencard.com.br/return-policy",
    siteName: "Rencard",
    locale: "pt_BR",
    type: "website",
  },
};

const termsTitleData = {
  title: "POLÍTICA DE TROCA, DEVOLUÇÃO E GARANTIA | RENCARD",
  description: "Última atualização em 06/01/2026",
  info: "A Rencard busca oferecer a melhor experiência de compra e qualidade em seus produtos. Esta política estabelece as regras para trocas, devoluções por arrependimento e acionamento da garantia, em conformidade com o Código de Defesa do Consumidor (CDC).",
};

export default function ReturnPolicy() {
  return (
    <div className="flex flex-col mx-auto my-[3.75rem] px-[5rem] max-sm:px-[1.25rem] max-sm:my-[1.875rem] max-w-[80rem] w-full">
      <TermsTitle
        title={termsTitleData.title}
        description={termsTitleData.description}
        info={termsTitleData.info}
      />

      {/* 1 */}
      <LegalSection title="1. Direito de Arrependimento">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          De acordo com o Art. 49 do CDC, você tem o prazo de 07 (sete) dias
          corridos, a contar da data de recebimento do produto, para desistir da
          compra, sem necessidade de justificativa. Condições para Devolução por
          Arrependimento: O produto deve ser devolvido na embalagem original,
          sem indícios de uso, com todos os acessórios, manuais e notas fiscais.
          <br />
          Processo: Para iniciar uma devolução por arrependimento, entre em
          contato com nosso suporte em suporte@rencard.com.br
          (mailto:suporte@rencard.com.br) dentro do prazo. Nós forneceremos um
          código de postagem e instruções. Reembolso: Após a confirmação do
          recebimento do produto em nosso centro de distribuição e da
          verificação de seu estado, o valor integral da compra será reembolsado
          no prazo de até 07 (sete) dias úteis, na mesma forma de pagamento
          original.
        </p>
      </LegalSection>

      {/* 2 */}
      <LegalSection title="2. Garantia Legal Contra Defeitos">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Todos os produtos físicos Rencard (Tags e Cartões) possuem garantia
          legal de 90 (noventa) dias, contados a partir da data de recebimento
          pelo cliente, para defeitos de fabricação ou vícios ocultos que os
          tornem impróprios para o uso (Art. 26 do CDC). Como Acionar a
          Garantia: Em caso de suspeita de defeito, entre em contato
          imediatamente com nosso suporte. Poderemos solicitar fotos ou vídeos
          que demonstrem o problema para avaliação prévia.
          <br />
          Análise e Solução: Se confirmado o defeito, ofereceremos a solução
          mais adequada: reparo, substituição do produto ou reembolso. O prazo
          para resolução dependerá da análise logística.
          <br />
          Produto Fora da Garantia: Para problemas identificados após o período
          de garantia legal, ofereceremos suporte para avaliação e possível
          reparo, que poderá ser cobrado, mediante orçamento prévio.
        </p>
      </LegalSection>

      {/* 3 */}
      <LegalSection title="3. Custos de Envio para Devoluções e Trocas">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Em casos de arrependimento ou defeito coberto pela garantia, a Rencard
          arcará com todos os custos de frete para a devolução do produto e
          envio do novo (quando aplicável).
          <br />
          Em casos de troca por motivos não cobertos por esta política (ex.:
          descuido do cliente), os custos de frete serão de responsabilidade do
          cliente.
        </p>
      </LegalSection>

      {/* 4 */}
      <LegalSection title="4. Exceções e Situações Não Cobertas">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Esta política não cobre:
          <br />
          Danos causados por uso inadequado, acidente, modificação não
          autorizada ou desgaste natural do produto. Produtos comprados de
          terceiros que não sejam revendedores autorizados Rencard. Defeitos em
          dispositivos (celulares) causados pela utilização dos produtos
          Rencard.
        </p>
      </LegalSection>

      {/* 5 */}
      <LegalSection title="5. Contato para Suporte">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Para solicitar trocas, devoluções ou acionar a garantia, entre em
          contato:
          <br />
          E-mail: suporte@rencard.com.br (mailto:suporte@rencard.com.br)
          <br />
          Assunto: &quot;Devolução/Garantia - [Número do Pedido]&quot;
        </p>
      </LegalSection>
    </div>
  );
}
