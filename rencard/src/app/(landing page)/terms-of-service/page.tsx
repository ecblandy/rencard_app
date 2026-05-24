import { LegalList } from "@/components/landing-page/terms/legal-list";
import { LegalSection } from "@/components/landing-page/terms/legal-section";
import TermsTitle from "@/components/landing-page/terms/terms-title";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos do Serviço de Assinatura | Rencard",
  description:
    "Conheça os termos que regem os planos de assinatura Rencard: cobrança recorrente, upgrades, cancelamentos e política de reembolso.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://rencard.com.br/terms-of-service",
  },
  openGraph: {
    title: "Termos do Serviço de Assinatura | Rencard",
    description:
      "Conheça os termos que regem os planos de assinatura Rencard: cobrança recorrente, upgrades, cancelamentos e política de reembolso.",
    url: "https://rencard.com.br/terms-of-service",
    siteName: "Rencard",
    locale: "pt_BR",
    type: "website",
  },
};

const termsTitleData = {
  title: "TERMOS DO SERVIÇO DE ASSINATURA | RENCARD",
  description: "Última atualização em 06/01/2026",
  info: 'Estes Termos do Serviço de Assinatura regulam especificamente o fornecimento dos planos de assinatura digital Rencard ("Assinatura" ou "Plano") e complementam os Termos de Uso Gerais da plataforma. Ao assinar um Plano pago, você concorda com estes termos.',
};

export default function TermsOfService() {
  return (
    <div className="flex flex-col mx-auto my-[3.75rem] px-[5rem] max-sm:px-[1.25rem] max-sm:my-[1.875rem] max-w-[80rem] w-full">
      <TermsTitle
        title={termsTitleData.title}
        description={termsTitleData.description}
        info={termsTitleData.info}
      />

      {/* 1 */}
      <LegalSection title="1. Natureza do Serviço e Primeiro Mês">
        <LegalList
          items={[
            "A Assinatura Rencard é um serviço recorrente (Software as a Service - SaaS) que concede acesso à plataforma digital para criação, edição e gestão do seu perfil Rencard.",
            `O primeiro mês de Assinatura é fornecido como parte integrante da compra de qualquer produto físico Rencard (Tag ou Cartão, entre outros). Este período não é um "teste grátis" separado, mas sim a ativação inicial do serviço pago já incluso no valor do seu kit.`,
          ]}
        />
      </LegalSection>

      {/* 2 */}
      <LegalSection title="2. Planos, Preços e Cobrança Recorrente">
        <LegalList
          items={[
            "Oferecemos os seguintes Planos: Rencard Da Galera e Rencard Pro. Os preços, funcionalidades e periodicidades (mensal/anual/semestral) são detalhados em nossa página de vendas.",
            "Renovação Automática: Todos os Planos de assinatura têm renovação automática ao final do período contratado (ex.: plano anual se renova anualmente). A cobrança é feita no cartão de crédito cadastrado.",
            "Aviso de Renovação: Enviaremos um e-mail de aviso sobre a cobrança de renovação com pelo menos 07 (sete) dias de antecedência para o e-mail cadastrado em sua conta. É sua responsabilidade manter os dados de pagamento atualizados e verificar sua caixa de entrada.",
          ]}
        />
      </LegalSection>

      {/* 3 */}
      <LegalSection title="3. Upgrades, Downgrades e Mudanças de Plano">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Upgrade (ex.: Da Galera → Pro): Você pode fazer upgrade para um Plano
          superior a qualquer momento. O valor da nova assinatura será cobrado
          de forma prorrateada, considerando o crédito proporcional do período
          não utilizado do seu Plano atual. O novo ciclo de cobrança recomeçará
          na data do upgrade.
          <br />
          Downgrade (ex.: Pro → Da Galera): Você pode fazer downgrade para um
          Plano inferior. A mudança será efetivada apenas no final do seu ciclo
          de cobrança atual. Enquanto isso, você mantém o acesso ao Plano
          superior já pago.
          <br />
          Efeito nas Funcionalidades e Conteúdo: Ao fazer downgrade de plano
          (ex.: de Pro para Da Galera) ou ao cancelar sua assinatura:
        </p>
        <LegalList
          items={[
            "Funcionalidades:As ferramentas exclusivas do plano superior (ex.: painel de analytics, integração com pixels, novos uploads de vídeo) serão imediatamente desativadas",
            ` Conteúdo Existente: O conteúdo criado durante o período de assinatura do plano superior (ex.: um vídeo já publicado, métricas históricas) permanecerá visível em seu perfil, porém em estado "somente leitura". Você não poderá editá-lo, substituí-lo ou acessar ferramentas avançadas associadas a ele sem um novo upgrade.`,
            "Responsabilidade: A Rencard não é responsável por backups do conteúdo do usuário. Recomendamos fortemente que você salve localmente materiais importantes antes de qualquer downgrade.",
          ]}
        />
      </LegalSection>

      {/* 4 */}
      <LegalSection title="4. Cancelamento e Reembolsos">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Como Cancelar: Você pode cancelar a renovação automática da sua
          Assinatura a qualquer momento através das configurações da sua conta
          no site Rencard ou entrando em contato com nosso suporte. O
          cancelamento evita apenas futuras cobranças.
          <br />
          Política de Reembolso (Lei do Arrependimento): A compra do produto
          físico está sujeita ao direito de arrependimento de 07 (sete) dias
          corridos, conforme o Código de Defesa do Consumidor. O reembolso,
          neste caso, será do valor total pago pelo kit (físico + primeiro mês
          de assinatura).
          <br />
          Política de Reembolso (Assinatura Paga): Não oferecemos reembolso por
          períodos parciais não utilizados da Assinatura após o início de um
          novo ciclo de cobrança. Se você cancelar no meio de um período anual,
          por exemplo, o serviço permanecerá ativo até a data de vencimento já
          paga, sem direito a restituição do valor proporcional. Esta é a
          prática padrão do mercado SaaS.
          <br />
          Encerramento por Inadimplência: Em caso de não pagamento da renovação,
          sua Assinatura será suspensa após um período de carência, e seu perfil
          será rebaixado para o Plano Free Vitalício(perfil congelado e só de
          leitura).
        </p>
      </LegalSection>

      {/* 5 */}
      <LegalSection title="5. Plano Free Vitalício">
        <LegalList
          items={[
            "Caso você não renove uma Assinatura paga (por cancelamento ou inadimplência), seu perfil será automaticamente migrado para o Plano Free Vitalício.",
            "Neste Plano, seu perfil Rencard permanece público e acessível via seu link, QR Code e dispositivo NFC, porém não é mais editável. Todas as funcionalidades de edição e ferramentas avançadas serão bloqueadas.",
          ]}
        />
      </LegalSection>

      {/* 6 */}
      <LegalSection title="6. Alterações nos Termos e Preços">
        <LegalList
          items={[
            "A Rencard reserva-se o direito de modificar os preços dos Planos. Alterações de preço para a próxima renovação serão comunicadas com pelo menos 30 (trinta) dias de antecedência por e-mail.",
            "O uso continuado do Serviço após a renovação constitui aceitação do novo preço.",
          ]}
        />
      </LegalSection>

      {/* 7 */}
      <div>
        <span className="font-urbanist font-semibold text-[1.125rem]">
          Para questões sobre sua assinatura, entre em contato com nosso
          suporte:
        </span>
        <p className="font-urbanist font-semibold text-[1.125rem]">
          E-mail: suporte@rencard.com.br (mailto:suporte@rencard.com.br)
        </p>
      </div>
    </div>
  );
}
