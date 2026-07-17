import { Link } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import { SUPPORT_HREF } from '../support';

const sections = [
  {
    title: '1. Aceitacao dos termos',
    body: [
      'Estes Termos de Uso regulam o acesso e uso da Comvaga por clientes, profissionais parceiros, donos de negocio e visitantes.',
      'Ao criar conta, acessar a plataforma, cadastrar negocio, solicitar parceria, realizar agendamento, contratar plano ou publicar conteudo, voce declara que leu e concorda com estes termos.',
      'Se voce usa a Comvaga em nome de um negocio, declara possuir autorizacao para vincular esse negocio e assumir obrigacoes em seu nome.',
    ],
  },
  {
    title: '2. O que a Comvaga oferece',
    body: [
      'A Comvaga fornece tecnologia para vitrine online, agenda, cadastro de servicos, gestao de profissionais, agendamentos, notificacoes, depoimentos, planos e recursos relacionados.',
      'A Comvaga nao executa os servicos anunciados pelos negocios e profissionais. A responsabilidade pela prestacao do servico, atendimento, qualidade, disponibilidade, informacoes publicadas, precos e cumprimento de normas profissionais e do responsavel pelo negocio ou profissional anunciante.',
    ],
  },
  {
    title: '3. Contas e responsabilidades',
    body: [
      'O usuario deve fornecer informacoes verdadeiras, manter seus dados atualizados e proteger suas credenciais de acesso.',
      'E proibido usar a conta de terceiros, tentar acessar areas sem autorizacao, burlar limites tecnicos, automatizar requisicoes abusivas, explorar falhas, praticar fraude ou interferir no funcionamento da plataforma.',
      'A Comvaga pode aplicar medidas de seguranca, bloqueios, rate limits, revisoes, suspensoes ou encerramento de acesso quando houver risco, abuso, fraude, violacao destes termos ou exigencia legal.',
    ],
  },
  {
    title: '4. Clientes, agendamentos e cancelamentos',
    body: [
      'O cliente pode usar a plataforma para visualizar vitrines, escolher negocios, profissionais, servicos, datas e horarios disponiveis.',
      'O agendamento depende da disponibilidade configurada pelo negocio ou profissional e das regras de funcionamento da plataforma.',
      'Cancelamentos, remarcacoes, atrasos, nao comparecimento, reembolsos de servicos presenciais ou conflitos sobre atendimento devem observar as regras informadas pelo negocio e a legislacao aplicavel.',
      'A Comvaga pode enviar e-mails ou notificacoes transacionais sobre confirmacoes, lembretes, cancelamentos e alteracoes relacionadas ao agendamento.',
    ],
  },
  {
    title: '5. Negocios e profissionais',
    body: [
      'O responsavel pelo negocio deve cadastrar informacoes corretas sobre nome, endereco, contato, servicos, precos, horarios, profissionais, fotos, politicas de atendimento e demais dados exibidos na vitrine.',
      'Profissionais parceiros podem solicitar vinculo com negocios. A solicitacao pode ficar pendente, ser aprovada, recusada, inativada ou excluida conforme a regra do negocio e da plataforma.',
      'O negocio e responsavel por aprovar, remover, inativar e gerenciar profissionais vinculados, respeitando direitos de clientes, historico operacional e regras da plataforma.',
      'E proibido publicar servicos ilegais, enganosos, discriminatorios, ofensivos, perigosos ou que exijam habilitacao profissional sem que o responsavel cumpra os requisitos legais aplicaveis.',
    ],
  },
  {
    title: '6. Conteudo enviado por usuarios',
    body: [
      'O usuario declara possuir todos os direitos, licencas e autorizacoes necessarios para publicar fotos, logos, marcas, nomes, textos, depoimentos, descricoes, imagens de pessoas e qualquer outro conteudo enviado a Comvaga.',
      'E proibido publicar conteudo que viole direitos autorais, marcas, imagem, honra, privacidade, segredos comerciais, leis, direitos de terceiros ou estes termos.',
      'A Comvaga pode remover, bloquear ou restringir conteudo denunciado, ilegal, ofensivo, fraudulento, enganoso, abusivo, com suspeita de violacao de direitos ou incompatível com a finalidade da plataforma.',
      'Caso voce identifique conteudo que viole seus direitos, entre em contato com informacoes suficientes para identificacao do conteudo, titularidade alegada e justificativa do pedido de remocao.',
    ],
  },
  {
    title: '7. Planos, teste gratis e assinaturas',
    body: [
      'A Comvaga pode oferecer planos gratuitos, testes gratis e planos pagos com recursos, limites, precos, beneficios e condicoes descritos antes da contratacao.',
      'Antes do checkout, o usuario deve verificar preco, recorrencia, plano escolhido, recursos incluidos, limites de profissionais, condicoes promocionais, periodo de teste gratis quando houver e consequencias de inadimplencia ou cancelamento.',
      'Pagamentos e assinaturas podem ser processados por provedor externo de pagamento. A Comvaga pode receber status, identificadores e eventos de cobranca necessarios para ativar, manter, alterar, cancelar ou bloquear recursos do plano.',
      'A contratacao de plano nao transfere propriedade sobre a plataforma, codigo, marca, tecnologia ou recursos da Comvaga; ela concede apenas direito de uso conforme o plano ativo.',
    ],
  },
  {
    title: '8. Cancelamento de assinatura e arrependimento',
    body: [
      'O responsavel pelo negocio pode cancelar a assinatura pelos caminhos disponibilizados na plataforma ou pelo suporte.',
      'A Comvaga deve informar, de forma clara, os efeitos do cancelamento, incluindo eventual encerramento de recursos pagos, periodo de acesso remanescente, bloqueio de novos agendamentos online ou alteracoes no plano.',
      'Quando aplicavel pela legislacao de consumo, o usuario podera exercer direito de arrependimento em contratacoes realizadas fora do estabelecimento comercial no prazo legal.',
      'Pedidos de cancelamento, estorno ou ajuste podem depender do status do pagamento, do provedor de pagamento, do uso do servico, da data da contratacao e das regras legais aplicaveis.',
    ],
  },
  {
    title: '9. Comunicacoes',
    body: [
      'A Comvaga pode enviar comunicacoes transacionais necessarias ao uso da plataforma, como criacao de conta, recuperacao de senha, confirmacao de agendamento, lembretes, cancelamentos, seguranca, suporte, pagamento e avisos operacionais.',
      'A Comvaga nao realiza e-mail marketing atualmente. Se futuramente enviar comunicacoes promocionais, adotara identificacao clara, finalidade adequada e mecanismo de descadastro quando aplicavel.',
    ],
  },
  {
    title: '10. Privacidade e dados pessoais',
    body: [
      'O tratamento de dados pessoais e explicado na Politica de Privacidade da Comvaga.',
      'Ao usar a plataforma, voce reconhece que dados podem ser tratados para execucao do servico, seguranca, pagamentos, suporte, notificacoes, cumprimento legal, melhoria da plataforma e outras finalidades descritas na Politica de Privacidade.',
    ],
  },
  {
    title: '11. Propriedade intelectual da Comvaga',
    body: [
      'A marca Comvaga, layout, software, codigo, fluxos, textos institucionais, componentes, banco de dados, estrutura da plataforma e demais elementos pertencem a Comvaga ou a seus licenciadores.',
      'E proibido copiar, revender, reproduzir, modificar, explorar comercialmente, tentar extrair codigo-fonte, realizar engenharia reversa ou usar a plataforma de forma nao autorizada.',
    ],
  },
  {
    title: '12. Limitacao de responsabilidade',
    body: [
      'A Comvaga trabalha para manter a plataforma disponivel e segura, mas nao garante funcionamento ininterrupto, ausencia absoluta de erros, disponibilidade permanente de terceiros, internet, meios de pagamento, hospedagem ou notificacoes.',
      'A Comvaga nao se responsabiliza por servicos prestados pelos negocios ou profissionais, informacoes publicadas por usuarios, conduta de terceiros, indisponibilidades externas, perdas decorrentes de uso indevido da conta ou descumprimento destes termos.',
      'Nada nestes termos exclui direitos que nao possam ser limitados pela legislacao brasileira aplicavel.',
    ],
  },
  {
    title: '13. Alteracoes dos termos',
    body: [
      'Podemos atualizar estes termos para refletir mudancas legais, tecnicas, comerciais ou operacionais.',
      'Quando a alteracao for relevante, poderemos comunicar pelos canais disponiveis. O uso continuado da plataforma apos a atualizacao indica ciencia dos novos termos.',
    ],
  },
  {
    title: '14. Lei aplicavel e contato',
    body: [
      'Estes termos sao regidos pelas leis da Republica Federativa do Brasil.',
      'Para duvidas, suporte, pedidos de remocao de conteudo, cancelamento, privacidade ou reclamacoes, use o suporte oficial da Comvaga.',
      'Antes da publicacao definitiva, os dados juridicos da empresa, como razao social, CNPJ, endereco e e-mail oficial, devem ser preenchidos conforme a estrutura formal da Comvaga.',
    ],
  },
];

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
        <Link to="/" className="mb-8 inline-block">
          <img src="/Comvaga Logo.png" alt="Comvaga" className="h-14 w-auto object-contain" />
        </Link>

        <div className="mb-10 border-b border-gray-900 pb-8">
          <p className="mb-3 text-xs uppercase text-primary">Legal</p>
          <h1 className="text-4xl font-normal uppercase">Termos de Uso</h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Ultima atualizacao: 17 de julho de 2026. Estes termos explicam as regras de uso da Comvaga
            por clientes, profissionais parceiros, donos de negocio e visitantes.
          </p>
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
            Precisa falar com a Comvaga? <a href={SUPPORT_HREF} target="_blank" rel="noreferrer" className="text-primary hover:text-yellow-400">Acesse o suporte</a>.
          </p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
