import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function ParceiroLogin({ onLogin, suppressAuthRef }) {
  const navigate = useNavigate();

  const [email,   setEmail]   = useState('');
  const [senha,   setSenha]   = useState('');
  const [slug,    setSlug]    = useState('');
  const [loading, setLoading] = useState(false);
  const [erro,    setErro]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    const emailClean = email.trim().toLowerCase();
    const slugClean  = slug.trim().toLowerCase();

    if (!emailClean || !emailClean.includes('@')) return setErro('Email inválido.');
    if (senha.length < 6)                        return setErro('Senha deve ter ao menos 6 caracteres.');
    if (!slugClean)                              return setErro('Informe o slug do negócio.');

    setLoading(true);
    if (suppressAuthRef) suppressAuthRef.current = true;

    try {
      const { data: negocio, error: negErr } = await supabase
        .from('negocios')
        .select('id')
        .eq('slug', slugClean)
        .maybeSingle();

      if (negErr) throw negErr;
      if (!negocio) return setErro('Negócio não encontrado. Verifique o slug informado.');

      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: emailClean,
        password: senha,
      });

      if (signInErr) {
        if (String(signInErr.message || '').toLowerCase().includes('invalid')) {
          return setErro('Email ou senha incorretos.');
        }
        throw signInErr;
      }

      const uid = signInData?.user?.id;
      if (!uid) throw new Error('Falha ao autenticar.');

      const { data: prof, error: profErr } = await supabase
        .from('profissionais')
        .select('id, status, negocio_id')
        .eq('negocio_id', negocio.id)
        .eq('user_id', uid)
        .maybeSingle();

      if (profErr) throw profErr;

      if (!prof) {
        await supabase.auth.signOut();
        return setErro('Você não é parceiro deste negócio.');
      }
      if (prof.status === 'pendente') {
        await supabase.auth.signOut();
        return setErro('Seu acesso ainda não foi aprovado pelo responsável do negócio.');
      }
      if (prof.status === 'inativo') {
        await supabase.auth.signOut();
        return setErro('Seu acesso está inativo. Entre em contato com o responsável.');
      }

      if (suppressAuthRef) suppressAuthRef.current = false;
      onLogin(signInData.user, 'professional');
      navigate('/dashboard', { state: { negocioId: negocio.id } });

    } catch (e) {
      console.error('ParceiroLogin error:', e);
      setErro(e?.message || 'Erro inesperado. Tente novamente.');
      await supabase.auth.signOut();
    } finally {
      if (suppressAuthRef) suppressAuthRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-yellow-600 rounded-custom flex items-center justify-center mx-auto mb-4">
            <span className="text-black text-2xl font-normal">C</span>
          </div>
          <h1 className="text-3xl font-normal text-white uppercase">Login Parceiro</h1>
          <p className="text-gray-500 text-sm mt-2 font-normal">Acesse o painel do seu negócio</p>
        </div>

        <div className="bg-dark-100 border border-gray-800 rounded-custom p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs text-gray-400 uppercase mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-dark-200 border border-gray-800 rounded-custom text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-colors font-normal"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase mb-2">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-dark-200 border border-gray-800 rounded-custom text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-colors font-normal"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase mb-2">Slug do negócio</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ex: barbearia-do-ze"
                className="w-full px-4 py-3 bg-dark-200 border border-gray-800 rounded-custom text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-colors font-normal"
                required
              />
            </div>

            {erro && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-custom px-4 py-3 text-red-400 text-sm font-normal">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-yellow-600 text-black rounded-button font-normal uppercase disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6 font-normal">
          Ainda não tem cadastro?{' '}
          <Link to="/parceiro" className="text-primary hover:text-yellow-500 transition-colors">
            Solicitar acesso
          </Link>
        </p>

      </div>
    </div>
  );
}
