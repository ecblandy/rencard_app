import { LegalList } from "@/components/landing-page/terms/legal-list";
import { LegalSection } from "@/components/landing-page/terms/legal-section";
import TermsTitle from "@/components/landing-page/terms/terms-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Rencard",
  description:
    "Leia os Termos de Uso da plataforma Rencard. Conheça as regras, direitos e responsabilidades ao utilizar nossos serviços.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://rencard.com.br/terms-of-use",
  },
  openGraph: {
    title: "Termos de Uso | Rencard",
    description:
      "Leia os Termos de Uso da plataforma Rencard. Conheça as regras, direitos e responsabilidades ao utilizar nossos serviços.",
    url: "https://rencard.com.br/terms-of-use",
    siteName: "Rencard",
    locale: "pt_BR",
    type: "website",
  },
};

const termsTitleData = {
  title: "POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS | RENCARD",
  description: "Última atualização em 05/01/2026",
  info: "A presente Política de Privacidade e Proteção de Dados tem como objetivo estabelecer as diretrizes e práticas adotadas pela Rencard para garantir a privacidade e a proteção dos dados pessoais dos usuários de nossos serviços. Comprometemo-nos a respeitar a privacidade de nossos usuários e a proteger suas informações pessoais de acordo com as leis aplicáveis, incluindo a Lei Geral de Proteção de Dados (LGPD) do Brasil. Esta política descreve como coletamos, usamos, armazenamos e compartilhamos os dados pessoais dos usuários, bem como os direitos que eles possuem em relação a essas informações. Ao utilizar nossos serviços, os usuários concordam com os termos desta Política de Privacidade e Proteção de Dados.",
};

const secondParagraphData = [
  {
    col1: "Dados de Cadastro",
    col2: "Nome completo, e-mail, número de telefone.",
    col3: "Criar e gerenciar sua conta na plataforma Rencard, fornecer suporte e enviar comunicações sobre o serviço (Execução de Contrato).",
  },

  {
    col1: "Dados do Perfil Rencard",
    col2: "Foto, links de redes sociais, chave PIX, descrição (bio), vídeos, links de portfólio.",
    col3: "Permitir que você personalize e exiba seu perfil digital, que é a funcionalidade central do nosso serviço (Execução de Contrato & Consentimento).",
  },
  {
    col1: "Dados de Pagamento",
    col2: "Dados da transação (valor, data), nunca  armazenamos números completos de cartão de crédito.",
    col3: "Processar a compra do produto físico e das assinaturas. O processamento é feito por gateways de pagamento terceirizados e seguros (Execução de Contrato & Obrigação Legal).",
  },
  {
    col1: "Dados de Entrega",
    col2: "Endereço completo para envio dos produtos físicos.",
    col3: "Cumprir com a entrega do produto físico que você adquiriu (Execução de Contrato).",
  },
  {
    col1: "Dados de Navegação",
    col2: "Endereço IP, tipo de navegador, páginas visitadas, tempo no site, origem do acesso.",
    col3: "Melhorar a experiência no site, analisar a performance de marketing e garantir a segurança (Legítimo Interesse). Utilizamos Cookies para essa finalidade (veja a seção 5).",
  },
  {
    col1: "Dados de Uso da Plataforma",
    col2: "Estatísticas de acesso ao seu perfil (visualizações, cliques), configurações de integração (ex: Pixel ID do Facebook).",
    col3: "Fornecer as funcionalidades do plano Rencard Pro, como analytics, e melhorar nossos serviços (Execução de Contrato & Legítimo Interesse).",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col justify mx-auto my-[3.75rem] px-[5rem] max-sm:px-[1.25rem] max-sm:my-[1.875rem] max-w-[80rem] w-full">
      <TermsTitle
        title={termsTitleData.title}
        description={termsTitleData.description}
        info={termsTitleData.info}
      />

      {/* 1 */}
      <LegalSection title="1. Encarregado pelo Tratamento de Dados (DPO)">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Encarregado pelo tratamento de dados pessoais na Rencard é o
          nosso Data Protection Officer (DPO). Para quaisquer questões
          relacionadas a esta política ou aos seus dados, entre em contato:
        </p>

        <LegalList
          items={[
            "E-mail: contato@rencard.com.br",
            `Assunto: "Privacidade de Dados - LGPD"`,
          ]}
        />
      </LegalSection>

      {/* 2 */}
      <LegalSection title="2. Quais Dados Pessoais Coletamos e Para Que Finalidades?">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Coletamos diferentes tipos de dados para diferentes finalidades
          legítimas:
        </p>

        <div className="w-full overflow-x-auto">
          <table className="w-full font-urbanist text-[1.125rem] border-collapse">
            <thead>
              <tr>
                <th className="text-left font-bold pb-4 pr-6 whitespace-nowrap">
                  Categoria de Dado
                </th>
                <th className="text-left font-bold pb-4 pr-6 whitespace-nowrap">
                  Exemplos
                </th>
                <th className="text-left font-bold pb-4">
                  Finalidade Principal (Base Legal)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {secondParagraphData.map((item, i) => (
                <tr key={i}>
                  <td className="py-[1.4375rem] pr-6 align-top">{item.col1}</td>
                  <td className="py-[1.4375rem] pr-6 align-top">{item.col2}</td>
                  <td className="py-[1.4375rem] align-top">{item.col3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      {/* 3 */}
      <LegalSection title="3. Com Quem Compartilhamos Seus Dados?">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Seus dados podem ser compartilhados apenas com os seguintes terceiros,
          para as finalidades estritamente necessárias:
        </p>

        <LegalList
          items={[
            "Provedores de Pagamento (Gateways): Como Asaas / Mercado Pago, para processar suas transações financeiras de forma segura.",
            "Empresas de Logística e Entrega: Como Correios ou transportadoras, para enviar seu produto físico até você.",
            "Provedores de Serviços de Tecnologia: Para hospedagem do site, envio de e-mails transacionais e análise de dados (ex: Google Analytics, Meta Pixel). Esses parceiros têm obrigações contratuais para proteger seus dados.",
            "Autoridades Legais: Quando exigido por lei, regulamento, processo legal ou solicitação governamental.",
          ]}
        />

        <span className="block mt-[1.25rem] font-urbanist font-semibold text-[1.125rem]">
          Nós NÃO vendemos seus dados pessoais.
        </span>
      </LegalSection>

      {/* 4 */}
      <LegalSection title="4. Por Quanto Tempo Armazenamos Seus Dados?">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Manteremos seus dados apenas pelo tempo necessário para cumprir as
          finalidades descritas nesta política, a menos que um período de
          retenção mais longo seja exigido ou permitido por lei. Por exemplo:
        </p>

        <LegalList
          items={[
            "Dados da conta: Enquanto você mantiver uma conta ativa conosco.",
            "Dados de transações: Pela legislação fiscal.",
            "Dados do perfil: Até você solicitar a exclusão da conta.",
          ]}
        />

        <span className="block mt-[1.25rem] font-urbanist font-semibold text-[1.125rem]">
          Ao final do período, os dados serão anonimizados ou excluídos de forma
          segura.
        </span>
      </LegalSection>

      {/* 5 */}
      <LegalSection title="5. Uso de Cookies e Tecnologias Similares">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Nosso site utiliza Cookies para melhorar sua experiência. Eles nos
          ajudam a:
        </p>

        <LegalList
          items={[
            "Lembrar suas preferências.",
            "Entender como você usa nosso site (via Google Analytics).",
            "Medir a eficácia de campanhas publicitárias (via Meta Pixel).",
          ]}
        />

        <span className="block mt-[1.25rem] font-urbanist font-semibold text-[1.125rem]">
          Você pode controlar o uso de Cookies nas configurações do seu
          navegador. No entanto, desativá-los pode limitar algumas
          funcionalidades do site.
        </span>
      </LegalSection>

      {/* 6 */}
      <LegalSection title="6. Seus Direitos sob a LGPD">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Você tem os seguintes direitos em relação aos seus dados pessoais:
        </p>

        <LegalList
          items={[
            "Confirmação e Acesso: Solicitar confirmação da existência de tratamento e acesso aos seus dados.",
            "Correção: Pedir a correção de dados incompletos, inexatos ou desatualizados.",
            "Anonimização, Bloqueio ou Eliminação: Solicitar a anonimização, bloqueio ou eliminação de dados tratados em desconformidade com a LGPD.",
            "Eliminação: Pedir a exclusão dos dados tratados com seu consentimento.",
            "Informação sobre Compartilhamento: Obter informações sobre com quem compartilhamos seus dados.",
            "Revogação do Consentimento: Revogar seu consentimento a qualquer momento (isso não afeta a legalidade do tratamento realizado antes da revogação).",
            "Oposição: Opor-se a tratamentos realizados com base no legítimo interesse.",
          ]}
        />

        <span className="block mt-[1.25rem] font-urbanist font-semibold text-[1.125rem]">
          Para exercer qualquer um desses direitos, entre em contato com nosso
          DPO no e-mail [contato@rencard.com.br](mailto:contato@rencard.com.br).
          Responderemos suas solicitações no prazo estabelecido pela LGPD.
        </span>
      </LegalSection>

      {/* 7 */}
      <LegalSection title="7. Segurança das Informações">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Adotamos medidas técnicas e administrativas adequadas para proteger
          seus dados pessoais contra acesso não autorizado, perda, destruição ou
          alteração. Nenhum método de transmissão ou armazenamento eletrônico é
          100% seguro, mas buscamos sempre utilizar as melhores práticas do
          mercado.
        </p>
      </LegalSection>

      {/* 8 */}
      <LegalSection title="8. Alterações a Esta Política">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Podemos atualizar esta Política de Privacidade periodicamente. A
          versão mais recente estará sempre disponível nesta página, com a data
          de &quot;Última atualização&quot; revisada. Notificaremos você sobre
          mudanças materiais por e-mail ou por um aviso em nosso site.
        </p>
      </LegalSection>

      {/* 9 */}
      <LegalSection title="9. Contato">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Se você tiver dúvidas, preocupações ou solicitações relacionadas a
          esta Política de Privacidade ou ao tratamento de seus dados pessoais,
          entre em contato conosco:
        </p>
      </LegalSection>

      {/* 9 */}
      <div>
        <span className="font-urbanist font-semibold text-[1.125rem]">
          Para questões relacionadas a estes Termos de Uso, entre em contato:
        </span>
        <p className="font-urbanist font-semibold text-[1.125rem]">
          E-mail: [suporte@rencard.com.br](mailto:suporte@rencard.com.br)
        </p>
      </div>
    </div>
  );
}
