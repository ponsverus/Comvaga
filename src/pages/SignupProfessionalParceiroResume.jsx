import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ptBR } from '../feedback/messages/ptBR';

const msgs = ptBR.parceiroCadastro;

function Alerta({ msg }) {
  if (!msg) return null;
  const estilos = {
    erro: 'bg-red-500/10 border-red-500/30 text-red-400',
    aviso: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    sucesso: 'bg-green-500/10 border-green-500/30 text-green-400',
  };
  const classe = estilos[msg.variant] || estilos.erro;
  return (
    <div className={`border rounded-custom px-4 py-3 text-sm font-normal ${classe}`}>
      {msg.body}
    </div>
  );
}

function FieldRow({ label, children, last = false }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-3 ${last ? '' : 'border-b border-gray-800'}`}>
      <label className="w-[82px] shrink-0 text-sm tracking-wide text-gray-500">{label}</label>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

const fieldInputClass = 'w-full bg-transparent px-0 py-2 text-sm text-white placeholder-gray-600 outline-none focus:text-white';

export default function SignupProfessionalParceiroResume({ user, onLogin }) {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    const fallbackNome = String(user?.user_metadata?.nome || '').trim();
    if (fallbackNome) setNome(fallbackNome);
  }, [user?.user_metadata?.nome]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setAlerta(null);

    const nomeClean = nome.trim().replace(/\s+/g, ' ');
    const slugClean = slug.trim().toLowerCase();

    if (!nomeClean) return setAlerta(msgs.nome_required);
    if (!slugClean) return setAlerta(msgs.slug_required);

    setLoading(true);

    try {
      const { data: signupStatus, error: signupStatusErr } = await supabase.rpc('get_partner_signup_context', {
        p_slug: slugClean,
      });

      if (signupStatusErr) throw signupStatusErr;
      if (signupStatus?.status === 'negocio_not_found') return setAlerta(msgs.negocio_not_found);
      if (signupStatus?.status === 'plan_not_supported') return setAlerta(msgs.partner_plan_unavailable);
      if (signupStatus?.status !== 'available' || !signupStatus?.negocio_id) {
        throw new Error(msgs.unexpected_error.body);
      }

      const { data: accessData, error: accessErr } = await supabase.rpc('solicitar_acesso_parceiro', {
        p_negocio_id: signupStatus.negocio_id,
        p_nome: nomeClean,
      });

      if (accessErr) {
        const code = String(accessErr.message || '').split(':')[0].trim();
        if (code === 'access_inactive') return setAlerta(msgs.access_inactive);
        if (code === 'partner_plan_unavailable') return setAlerta(msgs.partner_plan_unavailable);
        if (code === 'usuario_nao_encontrado') return setAlerta(msgs.account_create_error);
        if (code === 'negocio_nao_encontrado' || code === 'negocio_nao_informado') return setAlerta(msgs.negocio_not_found);
        if (accessErr.code === '23505') return setAlerta(msgs.access_unavailable);
        throw accessErr;
      }

      const accessStatus = String(accessData?.status || '').trim();
      if (accessStatus !== 'pending_approval' && accessStatus !== 'ok') {
        throw new Error(msgs.unexpected_error.body);
      }

      if (accessStatus === 'ok') {
        onLogin?.(user, 'professional', 'completed', 'active');
        navigate('/dashboard', {
          replace: true,
          state: { negocioId: signupStatus.negocio_id },
        });
        return;
      }

      onLogin?.(user, 'professional', 'pending', 'partner_pending', 'partner');
      navigate('/parceiro/aguardando', { replace: true });
    } catch (err) {
      setAlerta({ body: err?.message || msgs.unexpected_error.body, variant: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/Comvaga Logo.png" alt="COMVAGA" className="h-20 w-auto object-contain mx-auto mb-4" />
          <h1 className="text-3xl font-normal text-white uppercase">SOLICITAR PARCERIA</h1>
          <p className="text-gray-500 text-sm mt-2 font-normal">INFORME O NEGÓCIO E AGUARDE O AVAL</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="overflow-hidden rounded-custom border border-gray-800 bg-dark-100">
            <FieldRow label="E-MAIL">
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className={`${fieldInputClass} uppercase text-gray-400`}
                placeholder="E-MAIL"
              />
            </FieldRow>

            <FieldRow label="NOME">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="NOME COMPLETO"
                className={`${fieldInputClass} uppercase`}
                required
              />
            </FieldRow>

            <FieldRow label="SLUG" last>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="EX: BARBEARIA-TORRES"
                className={fieldInputClass}
                required
              />
            </FieldRow>
          </div>

          <Alerta msg={alerta} />

          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-yellow-600 text-black rounded-button font-normal uppercase disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'ENVIANDO...' : 'SOLICITAR ACESSO'}
            </button>

            <Link
              to="/"
              className="flex w-full items-center justify-center rounded-button border border-primary/30 bg-transparent py-3 text-sm font-normal uppercase tracking-wider text-primary transition-all hover:border-primary hover:text-yellow-500"
            >
              VOLTAR
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
