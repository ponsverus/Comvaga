import { Link } from 'react-router-dom';
import AppFooter from '../components/AppFooter';

const sections = [
  {
    title: '1. Aceitação dos termos',
    body: [
      'Estes Termos de Uso regulam o acesso e uso da Comvaga por clientes, profissionais parceiros, donos de negócio e visitantes.',
      'Ao criar conta, acessar a plataforma, cadastrar negócio, solicitar parceria, realizar agendamento, contratar plano ou publicar conteúdo, você declara que leu e concorda com estes termos.',
      'Se você usa a Comvaga em nome de um negócio, declara possuir autorização para vincular esse negócio e assumir obrigações em seu nome.',
    ],
  },
  {
    title: '2. O que a Comvaga oferece',
    body: [
      'A Comvaga fornece tecnologia para vitrine online, agenda, cadastro de serviços, gestão de profissionais, agendamentos, notificações, depoimentos, planos e recursos relacionados.',
      'A Comvaga não executa os serviços anunciados pelos negócios e profissionais. A responsabilidade pela prestação do serviço, atendimento, qualidade, disponibilidade, informações publicadas, preços e cumprimento de normas profissionais é do responsável pelo negócio ou profissional anunciante.',
    ],
  },
  {
    title: '3. Contas e responsabilidades',
    body: [
      'O usuário deve fornecer informações verdadeiras, manter seus dados atualizados e proteger suas credenciais de acesso.',
      'É proibido usar a conta de terceiros, tentar acessar áreas sem autorização, burlar limites técnicos, automatizar requisições abusivas, explorar falhas, praticar fraude ou interferir no funcionamento da plataforma.',
      'A Comvaga pode aplicar medidas de segurança, bloqueios, rate limits, revisões, suspensões ou encerramento de acesso quando houver risco, abuso, fraude, violação destes termos ou exigência legal.',
    ],
  },
  {
    title: '4. Clientes, agendamentos e cancelamentos',
    body: [
      'O cliente pode usar a plataforma para visualizar vitrines, escolher negócios, profissionais, serviços, datas e horários disponíveis.',
      'O agendamento depende da disponibilidade configurada pelo negócio ou profissional e das regras de funcionamento da plataforma.',
      'Cancelamentos, remarcações, atrasos, não comparecimento, reembolsos de serviços presenciais ou conflitos sobre atendimento devem observar as regras informadas pelo negócio e a legislação aplicável.',
      'A Comvaga pode enviar e-mails ou notificações transacionais sobre confirmações, lembretes, cancelamentos e alterações relacionadas ao agendamento.',
    ],
  },
  {
    title: '5. Negócios e profissionais',
    body: [
      'O responsável pelo negócio deve cadastrar informações corretas sobre nome, endereço, contato, serviços, preços, horários, profissionais, fotos, políticas de atendimento e demais dados exibidos na vitrine.',
      'Profissionais parceiros podem solicitar vínculo com negócios. A solicitação pode ficar pendente, ser aprovada, recusada, inativada ou excluída conforme a regra do negócio e da plataforma.',
      'O negócio é responsável por aprovar, remover, inativar e gerenciar profissionais vinculados, respeitando direitos de clientes, histórico operacional e regras da plataforma.',
      'É proibido publicar serviços ilegais, enganosos, discriminatórios, ofensivos, perigosos ou que exijam habilitação profissional sem que o responsável cumpra os requisitos legais aplicáveis.',
    ],
  },
  {
    title: '6. Conteúdo enviado por usuários',
    body: [
      'O usuário declara possuir todos os direitos, licenças e autorizações necessários para publicar fotos, logos, marcas, nomes, textos, depoimentos, descrições, imagens de pessoas e qualquer outro conteúdo enviado à Comvaga.',
      'É proibido publicar conteúdo que viole direitos autorais, marcas, imagem, honra, privacidade, segredos comerciais, leis, direitos de terceiros ou estes termos.',
      'A Comvaga pode remover, bloquear ou restringir conteúdo denunciado, ilegal, ofensivo, fraudulento, enganoso, abusivo, com suspeita de violação de direitos ou incompatível com a finalidade da plataforma.',
      'Caso você identifique conteúdo que viole seus direitos, entre em contato com informações suficientes para identificação do conteúdo, titularidade alegada e justificativa do pedido de remoção.',
    ],
  },
  {
    title: '7. Planos, teste grátis e assinaturas',
    body: [
      'A Comvaga pode oferecer planos gratuitos, testes grátis e planos pagos com recursos, limites, preços, benefícios e condições descritos antes da contratação.',
      'Antes do checkout, o usuário deve verificar preço, recorrência, plano escolhido, recursos incluídos, limites de profissionais, condições promocionais, período de teste grátis quando houver e consequências de inadimplência ou cancelamento.',
      'Pagamentos e assinaturas podem ser processados por provedor externo de pagamento. A Comvaga pode receber status, identificadores e eventos de cobrança necessários para ativar, manter, alterar, cancelar ou bloquear recursos do plano.',
      'A contratação de plano não transfere propriedade sobre a plataforma, código, marca, tecnologia ou recursos da Comvaga; ela concede apenas direito de uso conforme o plano ativo.',
    ],
  },
  {
    title: '8. Cancelamento de assinatura e arrependimento',
    body: [
      'O responsável pelo negócio pode cancelar a assinatura pelos caminhos disponibilizados na plataforma ou pelo suporte.',
      'A Comvaga deve informar, de forma clara, os efeitos do cancelamento, incluindo eventual encerramento de recursos pagos, período de acesso remanescente, bloqueio de novos agendamentos online ou alterações no plano.',
      'Quando aplicável pela legislação de consumo, o usuário poderá exercer direito de arrependimento em contratações realizadas fora do estabelecimento comercial no prazo legal.',
      'Pedidos de cancelamento, estorno ou ajuste podem depender do status do pagamento, do provedor de pagamento, do uso do serviço, da data da contratação e das regras legais aplicáveis.',
    ],
  },
  {
    title: '9. Comunicações',
    body: [
      'A Comvaga pode enviar comunicações transacionais necessárias ao uso da plataforma, como criação de conta, recuperação de senha, confirmação de agendamento, lembretes, cancelamentos, segurança, suporte, pagamento e avisos operacionais.',
      'A Comvaga não realiza e-mail marketing atualmente. Se futuramente enviar comunicações promocionais, adotará identificação clara, finalidade adequada e mecanismo de descadastro quando aplicável.',
    ],
  },
  {
    title: '10. Privacidade e dados pessoais',
    body: [
      'O tratamento de dados pessoais é explicado na Política de Privacidade da Comvaga.',
      'Ao usar a plataforma, você reconhece que dados podem ser tratados para execução do serviço, segurança, pagamentos, suporte, notificações, cumprimento legal, melhoria da plataforma e outras finalidades descritas na Política de Privacidade.',
    ],
  },
  {
    title: '11. Propriedade intelectual da Comvaga',
    body: [
      'A marca Comvaga, layout, software, código, fluxos, textos institucionais, componentes, banco de dados, estrutura da plataforma e demais elementos pertencem à Comvaga ou a seus licenciadores.',
      'É proibido copiar, revender, reproduzir, modificar, explorar comercialmente, tentar extrair código-fonte, realizar engenharia reversa ou usar a plataforma de forma não autorizada.',
    ],
  },
  {
    title: '12. Limitação de responsabilidade',
    body: [
      'A Comvaga trabalha para manter a plataforma disponível e segura, mas não garante funcionamento ininterrupto, ausência absoluta de erros, disponibilidade permanente de terceiros, internet, meios de pagamento, hospedagem ou notificações.',
      'A Comvaga não se responsabiliza por serviços prestados pelos negócios ou profissionais, informações publicadas por usuários, conduta de terceiros, indisponibilidades externas, perdas decorrentes de uso indevido da conta ou descumprimento destes termos.',
      'Nada nestes termos exclui direitos que não possam ser limitados pela legislação brasileira aplicável.',
    ],
  },
  {
    title: '13. Alterações dos termos',
    body: [
      'Podemos atualizar estes termos para refletir mudanças legais, técnicas, comerciais ou operacionais.',
      'Quando a alteração for relevante, poderemos comunicar pelos canais disponíveis. O uso continuado da plataforma após a atualização indica ciência dos novos termos.',
    ],
  },
  {
    title: '14. Lei aplicável e contato',
    body: [
      'Estes termos são regidos pelas leis da República Federativa do Brasil.',
      'Para dúvidas, suporte, pedidos de remoção de conteúdo, cancelamento, privacidade ou reclamações, use o link de suporte disponível no rodapé desta página.',
      'Antes da publicação definitiva, os dados jurídicos da empresa, como razão social, CNPJ, endereço e e-mail oficial, devem ser preenchidos conforme a estrutura formal da Comvaga.',
    ],
  },
];

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
        <Link to="/" className="mb-8 inline-block">
          <img src="/Comvaga Logo.png" alt="Comvaga" className="h-14 w-auto object-contain" />
        </Link>

        <div className="mb-10">
          <p className="mb-3 text-xs uppercase text-primary">Legal</p>
          <h1 className="text-4xl font-normal uppercase">Termos de Uso</h1>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-normal uppercase text-white">{section.title}</h2>
              <div className="space-y-3 text-sm leading-relaxed text-gray-400">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-custom border border-primary/20 bg-primary/5 p-5">
          <p className="text-sm leading-relaxed text-gray-300">
            Para falar com a Comvaga sobre estes termos, acesse o link de suporte disponível no rodapé.
          </p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
