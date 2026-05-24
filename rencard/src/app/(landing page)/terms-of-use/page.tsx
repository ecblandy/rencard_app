import { LegalList } from "@/components/landing-page/terms/legal-list";
import { LegalSection } from "@/components/landing-page/terms/legal-section";
import TermsTitle from "@/components/landing-page/terms/terms-title";

const termsTitleData = {
  title: "TERMOS DE USO DA PLATAFORMA RENCARD",
  description: "Última atualização em 05/01/2026",
  info: `IMPORTANTE: LEIA ATENTAMENTE ESTES TERMOS DE USO ("TERMOS") ANTES DE UTILIZAR OS SERVIÇOS DA RENCARD. Ao criar uma conta, adquirir um produto físico ou acessar nossa plataforma digital, você ("Usuário") concorda em ficar legalmente vinculado a estes Termos. Se você não concordar com qualquer parte destes Termos, não utilize nossos serviços.`,
};

export default function TermsOfUse() {
  return (
    <div className="flex flex-col justify mx-auto my-[3.75rem] px-[5rem] max-sm:px-[1.25rem] max-sm:my-[1.875rem] max-w-[80rem] w-full">
      <TermsTitle
        title={termsTitleData.title}
        description={termsTitleData.description}
        info={termsTitleData.info}
      />

      {/* 1 */}
      <LegalSection title="1. Aceitação dos Termos e Elegibilidade">
        <LegalList
          items={[
            "A plataforma Rencard Tecnologia Ltda. Com sede em Minas Gerais.",
            "Para utilizar a plataforma e configurar um perfil, o Usuário declara ter pelo menos 13 (treze) anos de idade.",
            "Para realizar qualquer compra (de produtos físicos ou assinaturas) em nosso site, o Usuário declara ser maior de 18 (dezoito) anos e ter capacidade legal plena, ou estar devidamente autorizado por seu responsável legal. A Rencard não se responsabiliza por compras realizadas por menores de idade sem autorização.",
          ]}
        />
      </LegalSection>

      {/* 2 */}
      <LegalSection title="2. Descrição do Serviço">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          O Rencard oferece uma solução integrada de identidade digital,
          composta por:
        </p>

        <LegalList
          items={[
            `Produtos Físicos: Tags NFC ("Renc") e Cartões de Visita digitais.`,
            "Plataforma Digital (SaaS): Um painel online onde o Usuário pode criar, editar e gerenciar um perfil digital pessoal ou profissional, que é acessado via tecnologia NFC (no produto físico) ou através de um link/QR Code único.",
          ]}
        />
      </LegalSection>

      {/* 3 */}
      <LegalSection title="3. Cadastro e Conta do Usuário">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          O Usuário é o único responsável por:
        </p>

        <LegalList
          items={[
            "Fornecer informações de cadastro verídicas, precisas e completas.",
            "Manter a confidencialidade de sua senha e de quaisquer atividades realizadas em sua conta.",
            "Notificar imediatamente a Rencard sobre qualquer uso não autorizado de sua conta.",
          ]}
        />
      </LegalSection>

      {/* 4 */}
      <LegalSection title="4. Conduta do Usuário e Conteúdo Proibido">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          O Usuário é integralmente responsável por todo o conteúdo (textos,
          imagens, vídeos, links) que publicar em seu perfil Rencard
          (&quot;Conteúdo do Usuário&quot;). <br />É expressamente proibido
          utilizar a plataforma Rencard para:
        </p>

        <LegalList
          items={[
            "Hospedar, distribuir ou promover qualquer conteúdo que seja ilegal, difamatório, obsceno, pornográfico, de ódio, violento, ou que promova a intolerância racial, religiosa ou de qualquer natureza.",
            "Praticar ou incentivar atividades fraudulentas, golpes, phishing ou qualquer ação que vise enganar terceiros.",
            "Notificar imediatamente a Rencard sobre qualquer uso não autorizado de sua conta.",
            "Violar direitos de propriedade intelectual, de publicidade ou de privacidade de terceiros.",
            "Coletar dados de terceiros sem consentimento.",
            "Enviar spam ou material não solicitado.",
            "Simular a identidade de outra pessoa ou entidade.",
            "A Rencard se reserva o direito, a seu exclusivo critério, de remover qualquer Conteúdo do Usuário que viole estes Termos e de suspender ou encerrar a conta do infrator, sem prejuízo de outras medidas legais.",
          ]}
        />
      </LegalSection>

      {/* 5 */}
      <LegalSection title="5. Propriedade Intelectual">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          Direitos da Rencard: Todo o software, design, interface, logotipos,
          marcas e a estrutura da plataforma Rencard são de propriedade
          exclusiva da Rencard ou de seus licenciadores e estão protegidos pelas
          leis de propriedade intelectual. Ao usar o Serviço, o Usuário recebe
          uma licença limitada, não exclusiva, intransferível e revogável
          para utilizar a plataforma Rencard com o objetivo de criar, hospedar e
          compartilhar seu próprio perfil digital, seja para fins pessoais ou
          profissionais/comerciais. É expressamente proibido tentar copiar,
          modificar, desmontar, revender ou explorar comercialmente qualquer
          parte da plataforma Rencard como se fosse um serviço próprio.
          <br />
          Direitos do Usuário: O Conteúdo publicado pelo Usuário em seu perfil
          continua sendo de sua propriedade. No entanto, ao publicar, o Usuário
          concede à Rencard uma licença mundial, não exclusiva e isenta de
          royalties para hospedar, exibir, reproduzir e distribuir tal Conteúdo
          exclusivamente para a finalidade de operar e fornecer o Serviço
          Rencard.
        </p>
      </LegalSection>

      {/* 6 */}
      <LegalSection title="6. Suspensão e Encerramento de Conta">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          A Rencard pode, imediatamente e sem aviso prévio, suspender ou
          encerrar o acesso do Usuário ao Serviço, incluindo o bloqueio de seu
          perfil digital, nas seguintes situações:
        </p>

        <LegalList
          items={[
            "Violação destes Termos de Uso, em especial as cláusulas de Conduta Proibida (4).",
            "Inadimplência no pagamento de qualquer assinatura (conforme regulado nos Termos de Assinatura).",
            "Requisição por autoridade competente.",
            "Suspeita fundada de atividade fraudulenta ou que coloque em risco a segurança da plataforma ou de outros usuários.",
          ]}
        />
      </LegalSection>

      {/* 7 */}
      <LegalSection title="7. Limitação de Responsabilidade">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          O Usuário entende e concorda que utiliza o Serviço por sua conta e
          risco. A Rencard não será responsável por:
        </p>

        <LegalList
          items={[
            "Danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou da incapacidade de usar o Serviço.",
            "A exatidão, legalidade ou adequação do Conteúdo publicado por outros usuários em seus perfis.",
            " Problemas técnicos, interrupções ou falhas no Serviço que estejam além de nosso controle razoável.",
          ]}
        />

        <span className="block mt-[1.25rem] font-urbanist font-semibold text-[1.125rem]">
          A Rencard atua como mera fornecedora da plataforma e não se
          responsabiliza por quaisquer transações, acordos ou relações
          estabelecidas entre os usuários a partir do contato gerado pelos
          perfis Rencard.
        </span>
      </LegalSection>

      {/* 8 */}
      <LegalSection title="8. Disposições Gerais">
        <p className="font-urbanist font-semibold text-[1.125rem]">
          O Usuário entende e concorda que utiliza o Serviço por sua conta e
          risco. A Rencard não será responsável por:
        </p>

        <LegalList
          items={[
            "Lei Aplicável: Estes Termos são regidos pelas leis da República Federativa do Brasil.",
            "Foro: Fica eleito o foro da comarca de Uberlândia-MG, com exclusão de qualquer outro, por mais privilegiado que seja, para dirimir quaisquer questões decorrentes destes Termos.",
            "Atualizações: A Rencard pode modificar estes Termos a qualquer momento. As alterações serão publicadas nesta página com a data de revisão atualizada. O uso continuado do Serviço após tais mudanças constitui aceitação dos novos Termos.",
            "Integridade: Estes Termos, juntamente com a Política de Privacidade e os Termos de Assinatura, constituem o acordo integral entre o Usuário e a Rencard.",
          ]}
        />
      </LegalSection>

      {/* 9 */}
      <div>
        <span className="font-urbanist font-semibold text-[1.125rem]">
          Rencard
        </span>
        <p className="font-urbanist font-semibold text-[1.125rem]">
          E-mail do DPO: [contato@rencard.com.br]
          (mailto:contato@rencard.com.br)
        </p>
      </div>
    </div>
  );
}
