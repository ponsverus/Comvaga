import { Link } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import { SUPPORT_HREF } from '../support';

const sections = [
  {
    title: '1. Quem somos e escopo desta politica',
    body: [
      'A Comvaga e uma plataforma de agenda, vitrine, gestao de servicos e relacionamento entre negocios, profissionais parceiros e clientes.',
      'Esta Politica explica como tratamos dados pessoais quando voce acessa o site, cria uma conta, agenda servicos, gerencia um negocio, atua como profissional parceiro, realiza pagamentos ou entra em contato com a Comvaga.',
      'A Comvaga pode atuar como controladora dos dados usados para operar a plataforma e, em algumas situacoes, como operadora de dados tratados por negocios e profissionais que usam a plataforma para atender seus clientes.',
    ],
  },
  {
    title: '2. Dados que podemos coletar',
    body: [
      'Dados de cadastro: nome, e-mail, senha criptografada, telefone, tipo de conta, identificadores internos e preferencias da conta.',
      'Dados de negocio e profissional: nome do negocio, slug, endereco, telefone, logo, fotos, galeria, servicos, precos, horarios, profissionais vinculados, status de parceria e informacoes de plano.',
      'Dados de cliente e agendamento: nome, e-mail, telefone, negocio escolhido, profissional, servico, data, horario, status do agendamento, cancelamentos, historico e valores relacionados.',
      'Conteudos enviados pelo usuario: fotos, textos, descricoes, depoimentos, nomes de servicos, informacoes de vitrine e demais materiais publicados ou armazenados na plataforma.',
      'Dados tecnicos e de seguranca: endereco IP, identificadores de sessao, registros de acesso, eventos de erro, tentativas de uso, limites de requisicao, informacoes do navegador e dispositivo.',
      'Dados de pagamento e assinatura: plano escolhido, status da assinatura, eventos de cobranca, identificadores de checkout, cliente ou assinatura no provedor de pagamento. A Comvaga nao armazena dados completos de cartao.',
    ],
  },
  {
    title: '3. Para que usamos os dados',
    body: [
      'Criar e proteger contas de clientes, profissionais e negocios.',
      'Permitir agendamentos, cancelamentos, lembretes, notificacoes transacionais e historico operacional.',
      'Publicar vitrines, logos, galerias, servicos, precos, horarios e depoimentos conforme configurado pelos usuarios responsaveis.',
      'Gerenciar vinculos entre negocios e profissionais parceiros, incluindo solicitacoes pendentes, aprovacoes, inativacoes e exclusoes.',
      'Processar planos, assinaturas, checkouts, cancelamentos, testes gratis, limites de plano e eventos de pagamento.',
      'Prevenir fraude, abuso, spam, uso automatizado indevido, tentativas excessivas e acessos nao autorizados.',
      'Melhorar a plataforma, corrigir erros, medir desempenho, desenvolver recursos e prestar suporte.',
      'Cumprir obrigacoes legais, regulatórias, fiscais, consumeristas e exercer direitos em processos administrativos, judiciais ou arbitrais.',
    ],
  },
  {
    title: '4. Bases legais',
    body: [
      'Tratamos dados conforme as bases previstas na LGPD, incluindo execucao de contrato, procedimentos preliminares relacionados a contrato, cumprimento de obrigacao legal ou regulatoria, exercicio regular de direitos, protecao contra fraude, legitimo interesse e consentimento quando exigido.',
      'Quando a base for legitimo interesse, avaliamos a finalidade, a necessidade do tratamento e os direitos dos titulares. Quando a base for consentimento, o titular podera revoga-lo pelos canais indicados nesta politica.',
    ],
  },
  {
    title: '5. Compartilhamento com terceiros',
    body: [
      'Podemos compartilhar dados com fornecedores necessarios para operar a plataforma, como hospedagem, banco de dados, autenticacao, armazenamento, e-mail transacional, notificacoes, meios de pagamento, suporte, seguranca e ferramentas de analise.',
      'Atualmente, a plataforma usa servicos como Supabase para infraestrutura, OneSignal para notificacoes/e-mails transacionais e Asaas para pagamentos e assinaturas.',
      'Tambem podemos compartilhar dados com negocios e profissionais envolvidos no atendimento solicitado pelo cliente, por exemplo dados necessarios para confirmar, executar, cancelar ou remarcar um agendamento.',
      'Nao vendemos listas de clientes. Se forem ativadas ferramentas de analytics, pixels de publicidade, mensuracao, remarketing ou plataformas como Google e Meta, isso sera tratado de forma transparente nesta politica e, quando exigido, por mecanismos de consentimento ou configuracao de cookies.',
      'Dados poderao ser compartilhados com autoridades publicas, reguladores, tribunais ou terceiros quando necessario para cumprir lei, ordem valida, prevenir fraude, proteger direitos ou responder a reclamacoes.',
    ],
  },
  {
    title: '6. Cookies, analytics e publicidade',
    body: [
      'Podemos usar cookies e tecnologias semelhantes para manter a sessao ativa, lembrar preferencias, proteger a conta, medir desempenho e entender o uso da plataforma.',
      'Cookies essenciais podem ser necessarios para login, seguranca e funcionamento do servico.',
      'Cookies analiticos, pixels de publicidade, tags de conversao e remarketing poderao ser usados para medir campanhas, melhorar o produto e divulgar a Comvaga. Quando esses recursos forem ativados, informaremos sua finalidade e adotaremos os controles exigidos pela legislacao aplicavel.',
      'As configuracoes do navegador podem permitir bloqueio ou remocao de cookies, mas isso pode afetar recursos essenciais da plataforma.',
    ],
  },
  {
    title: '7. E-mails e comunicacoes',
    body: [
      'Hoje enviamos principalmente comunicacoes transacionais, como criacao de conta, confirmacao de agendamento, novo agendamento, cancelamento, lembrete, recuperacao de senha, suporte, seguranca e avisos relacionados ao uso do servico.',
      'E-mails transacionais sao necessarios para funcionamento da plataforma e nao sao tratados como e-mail marketing.',
      'Se futuramente enviarmos comunicacoes promocionais, campanhas ou novidades comerciais, adotaremos identificacao clara do remetente, assunto honesto e mecanismo simples de descadastro quando aplicavel.',
    ],
  },
  {
    title: '8. Conteudo publico e dados visiveis',
    body: [
      'Algumas informacoes podem ser exibidas publicamente na vitrine do negocio, como nome do negocio, logo, fotos, servicos, precos, horarios, profissionais, depoimentos e dados de contato configurados pelo responsavel.',
      'O usuario responsavel deve garantir que possui autorizacao para publicar fotos, marcas, textos, nomes, imagens de pessoas e demais conteudos enviados para a plataforma.',
    ],
  },
  {
    title: '9. Retencao e exclusao',
    body: [
      'Mantemos dados pelo tempo necessario para operar a conta, prestar o servico, cumprir obrigacoes legais, resolver disputas, prevenir fraude, preservar historico operacional e exercer direitos.',
      'Solicitacoes de parceria pendentes podem ser removidas sem preservacao historica quando recusadas ou excluidas antes da aprovacao.',
      'Registros ligados a agendamentos, pagamentos, historico de negocio, seguranca e auditoria podem ser mantidos mesmo apos exclusao ou inativacao de determinados itens, quando necessario para finalidade legitima, obrigacao legal ou exercicio de direitos.',
    ],
  },
  {
    title: '10. Seguranca',
    body: [
      'Adotamos medidas tecnicas e administrativas para proteger dados pessoais, incluindo autenticacao, controle de acesso, politicas de permissao, registros de seguranca, limitacao de tentativas e segregacao de dados conforme o papel do usuario.',
      'Nenhum sistema e totalmente imune a riscos. Se identificarmos incidente relevante que possa afetar titulares, adotaremos as medidas cabiveis conforme a legislacao aplicavel.',
    ],
  },
  {
    title: '11. Direitos dos titulares',
    body: [
      'Nos termos da LGPD, o titular pode solicitar confirmacao de tratamento, acesso, correcao, anonimização, bloqueio, eliminacao, portabilidade, informacoes sobre compartilhamento, revisao de decisoes automatizadas quando aplicavel e revogacao do consentimento.',
      'Algumas solicitacoes podem depender de verificacao de identidade e podem ser limitadas por obrigacoes legais, seguranca, prevencao a fraude, preservacao de contratos ou exercicio regular de direitos.',
    ],
  },
  {
    title: '12. Contato',
    body: [
      'Para exercer direitos, tirar duvidas ou solicitar informacoes sobre privacidade, entre em contato pelo suporte oficial da Comvaga.',
      'Antes da publicacao definitiva, os dados juridicos do controlador, como razao social, CNPJ, endereco e e-mail do encarregado ou canal de privacidade, devem ser preenchidos conforme a estrutura formal da empresa.',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
        <Link to="/" className="mb-8 inline-block">
          <img src="/Comvaga Logo.png" alt="Comvaga" className="h-14 w-auto object-contain" />
        </Link>

        <div className="mb-10 border-b border-gray-900 pb-8">
          <p className="mb-3 text-xs uppercase text-primary">Legal</p>
          <h1 className="text-4xl font-normal uppercase">Politica de Privacidade</h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Ultima atualizacao: 17 de julho de 2026. Este documento foi escrito para explicar, de forma clara,
            como a Comvaga trata dados pessoais no funcionamento da plataforma.
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
            Duvidas sobre privacidade? <a href={SUPPORT_HREF} target="_blank" rel="noreferrer" className="text-primary hover:text-yellow-400">Fale com o suporte</a>.
          </p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
