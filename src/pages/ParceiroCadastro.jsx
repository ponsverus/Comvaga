import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { ptBR } from '../feedback/messages/ptBR';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const msgs = ptBR.parceiroCadastro;

export default function ParceiroCadastro({ suppressAuthRef }) {
  const navigate = useNavigate();

  const [nome,      setNome]      = useState('');
  const [email,     setEmail]     = useState('');
  const [senha,     setSenha]     = useState('');
  const [slug,      setSlug]      = useState('');
  const [loading,   setLoading]   = useState(false);
  const [erro,      setErro]      = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    const nomeClean  = nome.trim().toUpperCase().replace(/\s+/g, ' ');
    const emailClean = email.trim().toLowerCase();
    const slugClean  = slug.trim().toLowerCase();

    if (!nomeClean)                               return setErro(msgs.nome_required.body);
    if (!emailClean || !emailClean.includes('@')) return setErro(msgs.email_invalid.body);
    if (senha.length < 6)                         return setErro(msgs.senha_too_short.body);
    if (!slugClean)                               return setErro(msgs.slug_required.body);

    setLoading(true);
    if (suppressAuthRef) suppressAuthRef.current = true;

    try {
      const { data: negocio, error: negErr } = await supabase
        .from('negocios')
        .select('id, nome')
        .eq('slug', slugClean)
        .maybeSingle();

      if (negErr) throw negErr;
      if (!negocio) return setErro(msgs.negocio_not_found.body);

      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: emailClean,
        password: senha,
      });

      if (signUpErr) {
        if (String(signUpErr.message || '').toLowerCase().includes('already')) {
          return setErro(msgs.email_already_exists.body);
        }
        throw signUpErr;
      }

      const uid = signUpData?.user?.id;
      if (!uid) throw new Error(msgs.account_create_error.body);

      const { data: profExiste } = await supabase
        .from('profissionais')
        .select('id, status')
        .eq('negocio_id', negocio.id)
        .eq('user_id', uid)
        .maybeSingle();

      if (profExiste) {
        await supabase.auth.signOut();
        if (profExiste.status === 'pendente') return setErro(msgs.already_pending.body);
        if (profExiste.status === 'ativo')    return setErro(msgs.already_active.body);
        if (profExiste.status === 'inativo')  return setErro(msgs.access_inactive.body);
      }

      for (let i = 0; i < 6; i++) {
        const { data } = await supabase.from('users').select('id, type').eq('id', uid).maybeSingle();
        if (data?.id) {
          await supabase.from('users').update({ nome: nomeClean, type: 'professional' }).eq('id', uid);
          break;
        }
        await sleep(400);
      }

      const { error: profErr } = await supabase.from('profissionais').insert({
        negocio_id:     negocio.id,
        user_id:        uid,
        nome:           nomeClean,
        status:         'pendente',
        horario_inicio: '08:00',
        horario_fim:    '18:00',
        dias_trabalho:  [1, 2, 3, 4, 5, 6],
      });

      if (profErr) throw profErr;

      await supabase.auth.signOut();

      setShowAlert(true);

    } catch (e) {
      setErro(e?.message || msgs.unexpected_error.body);
      await supabase.auth.signOut();
    } finally {
      if (suppressAuthRef) suppressAuthRef.current = false;
      setLoading(false);
    }
  };

  if (showAlert) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-green-400 text-4xl">✓</span>
          </div>
          <h1 className="text-3xl font-normal text-white uppercase mb-4">{msgs.success_title}</h1>
          <p className="text-gray-400 font-normal mb-8">{msgs.success_body}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gradient-to-r from-primary to-yellow-600 text-black rounded-button font-normal uppercase"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-yellow-600 rounded-custom flex items-center justify-center mx-auto mb-4">
            <span className="text-black text-2xl font-normal">C</span>
          </div>
          <h1 className="text-3xl font-normal text-white uppercase">Cadastro Parceiro</h1>
          <p className="text-gray-500 text-sm mt-2 font-normal">Solicite acesso ao negócio</p>
        </div>

        <div className="bg-dark-100 border border-gray-800 rounded-custom p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs text-gray-400 uppercase mb-2">Seu nome</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo"
                className="w-full px-4 py-3 bg-dark-200 border border-gray-800 rounded-custom text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-colors font-normal" required />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-dark-200 border border-gray-800 rounded-custom text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-colors font-normal" required />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase mb-2">Crie uma senha</label>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 bg-dark-200 border border-gray-800 rounded-custom text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-colors font-normal" required />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase mb-2">Slug do negócio</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ex: barbearia-do-ze"
                className="w-full px-4 py-3 bg-dark-200 border border-gray-800 rounded-custom text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-colors font-normal" required />
              <p className="text-xs text-gray-600 mt-1 font-normal">Fornecido pelo responsável do negócio</p>
            </div>

            {erro && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-custom px-4 py-3 text-red-400 text-sm font-normal">
                {erro}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-yellow-600 text-black rounded-button font-normal uppercase disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'ENVIANDO...' : 'SOLICITAR ACESSO'}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6 font-normal">
          Já aprovado?{' '}
          <Link to="/parceiro/login" className="text-primary hover:text-yellow-500 transition-colors">
            Fazer login
          </Link>
        </p>

      </div>
    </div>
  );
}
