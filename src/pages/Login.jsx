import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase';
import { useFeedback } from '../feedback/useFeedback';
import { fetchUserAccessProfile } from '../utils/profileAccess';
import { clearPasswordRecoveryState } from '../utils/auth';
import { CrownIcon, UserIcon, ZapIcon } from '../components/icons';

export default function Login({ onLogin, inRecovery: inRecoveryProp = false }) {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const [isRecovery, setIsRecovery] = useState(inRecoveryProp);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  const [resetLoading, setResetLoading] = useState(false);

  const { showMessage } = useFeedback();

  useEffect(() => {
    setIsRecovery(!!inRecoveryProp);
    setStep(inRecoveryProp ? 2 : 1);
  }, [inRecoveryProp]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
        setStep(2);
      }
    });

    return () => {
      data?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const email = String(formData.email || '').trim();

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (authError) throw authError;

      const authUser = authData?.user;
      if (!authUser?.id) throw new Error('Falha ao autenticar.');

      const profile = await fetchUserAccessProfile(authUser.id);

      if (!profile) {
        await supabase.auth.signOut();
        throw new Error('Perfil inexistente. Conclua seu cadastro para acessar.');
      }

      if (!userType) {
        await supabase.auth.signOut();
        throw new Error('Selecione o tipo de conta para entrar.');
      }

      if (profile.type !== userType) {
        await supabase.auth.signOut();
        throw new Error(
          `Esta conta é de ${profile.type === 'client' ? 'CLIENTE' : 'PROFISSIONAL'}. Selecione o tipo correto.`
        );
      }

      if (profile.accessState === 'partner_pending') {
        onLogin?.(
          authUser,
          profile.type,
          profile.onboardingStatus,
          profile.accessState
        );
        navigate('/parceiro/aguardando', { replace: true });
        return;
      }

      onLogin?.(
        authUser,
        profile.type,
        profile.onboardingStatus,
        profile.accessState
      );

    } catch (err) {
      showMessage('login.auth_error', { msg: err?.message || '' });
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (resetLoading) return;

    const email = String(formData.email || '').trim();
    if (!email) {
      showMessage('login.reset_email_required');
      return;
    }

    setResetLoading(true);

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetErr) throw resetErr;

      showMessage('login.reset_sent');
    } catch (e) {
      showMessage('login.reset_error', { msg: e?.message || '' });
    } finally {
      setResetLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    if (recoveryLoading) return;

    setRecoveryLoading(true);

    try {
      if (newPassword.length < 6) {
        showMessage('login.recovery_password_too_short');
        return;
      }
      if (newPassword !== newPassword2) {
        showMessage('login.recovery_password_mismatch');
        return;
      }

      const { error: upErr } = await supabase.auth.updateUser({ password: newPassword });
      if (upErr) throw upErr;

      showMessage('login.recovery_password_updated');

      await supabase.auth.signOut();
      clearPasswordRecoveryState();
      navigate('/login');
    } catch (e2) {
      showMessage('login.recovery_password_update_error', { msg: e2?.message || '' });
    } finally {
      setRecoveryLoading(false);
    }
  };

  const title = isRecovery
    ? 'DEFINIR NOVA SENHA'
    : step === 1
      ? 'BEM-VINDO DE VOLTA'
      : `${userType === 'client' ? 'CLIENTE' : 'PROFISSIONAL'}`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:grid lg:grid-cols-12 relative overflow-hidden">
      
      {/* Background decorativo sutil integrado ao novo visual */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[140px] animate-pulse" />
      </div>

      {/* PAINEL DE LOGIN: Ocupa 5 colunas no desktop, ancorado à esquerda com linhas de ponta a ponta */}
      <div className="lg:col-span-5 border-r border-gray-800 bg-black relative z-10 flex flex-col justify-between min-h-screen">
        
        {/* Topo do Painel */}
        <div className="p-6 sm:p-8 md:p-12 border-b border-gray-800 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-normal tracking-widest uppercase">VOLTAR</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <img src="/Comvaga Logo.png" alt="COMVAGA" className="h-7 w-auto object-contain" />
            <span className="text-sm font-black tracking-wider">COMVAGA</span>
          </Link>
        </div>

        {/* Corpo do Formulário / Conteúdo Centralizado Internamente */}
        <div className="flex-grow flex flex-col justify-center px-6 sm:px-12 md:px-16 py-12">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase leading-tight mb-2">
              {title}
            </h1>
            {step === 1 && !isRecovery && (
              <p className="text-gray-500 text-sm uppercase tracking-wider">Escolha como deseja acessar sua conta</p>
            )}
            {step === 2 && !isRecovery && (
              <p className="text-gray-500 text-sm uppercase tracking-wider">Insira suas credenciais de acesso</p>
            )}
          </div>

          <div>
            {isRecovery ? (
              <form onSubmit={handleSetNewPassword} className="space-y-6">
                <div className="border border-gray-800 bg-dark-100/50 backdrop-blur-sm divide-y divide-gray-800">
                  <div className="flex items-center gap-3 px-5 py-4 focus-within:bg-white/5 transition-colors">
                    <label className="w-20 shrink-0 text-xs font-bold tracking-widest text-gray-400 uppercase">NOVA SENHA</label>
                    <input
                      type="password"
                      placeholder="NOVA SENHA"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-transparent px-0 py-1 text-sm text-white placeholder-gray-700 outline-none focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3 px-5 py-4 focus-within:bg-white/5 transition-colors">
                    <label className="w-20 shrink-0 text-xs font-bold tracking-widest text-gray-400 uppercase">CONFIRMAR</label>
                    <input
                      type="password"
                      placeholder="CONFIRME A SENHA"
                      value={newPassword2}
                      onChange={(e) => setNewPassword2(e.target.value)}
                      className="w-full bg-transparent px-0 py-1 text-sm text-white placeholder-gray-700 outline-none focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  disabled={recoveryLoading}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary to-yellow-600 text-black font-black text-sm tracking-wider uppercase rounded-button hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                >
                  {recoveryLoading ? 'SALVANDO...' : 'SALVAR NOVA SENHA'}
                </button>
              </form>
            ) : (
              <>
                {step === 1 ? (
                  /* SELEÇÃO DE TIPO: Agora com visual de bordas secas e integradas */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-800 border border-gray-800">
                    <button
                      type="button"
                      onClick={() => { setUserType('client'); setStep(2); }}
                      className="group relative bg-black p-8 text-left hover:bg-dark-100/40 transition-colors"
                    >
                      <UserIcon className="mb-4 text-blue-400 w-8 h-8 group-hover:scale-105 transition-transform" />
                      <div className="font-bold text-base tracking-wide text-white uppercase mb-1">CLIENTE</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Agendar um trabalho</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setUserType('professional'); setStep(2); }}
                      className="group relative bg-black p-8 text-left hover:bg-dark-100/40 transition-colors"
                    >
                      <CrownIcon className="mb-4 text-primary w-8 h-8 group-hover:scale-105 transition-transform" />
                      <div className="font-bold text-base tracking-wide text-white uppercase mb-1">PROFISSIONAL</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Gerenciar negócio</div>
                    </button>
                  </div>
                ) : (
                  /* FORMULÁRIO DE LOGIN COM LINHA CONTÍNUA OPERACIONAL */
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-gray-500 hover:text-primary transition-colors group"
                      >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                        TROCAR TIPO
                      </button>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={resetLoading}
                        className="inline-flex shrink-0 items-center justify-center rounded-full border border-yellow-500/20 bg-transparent px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase text-yellow-400 transition-colors hover:border-yellow-500 hover:text-yellow-300 disabled:opacity-50"
                      >
                        {resetLoading ? 'ENVIANDO...' : 'ESQUECI A SENHA'}
                      </button>
                    </div>

                    {/* Inputs envelopados em uma estrutura unificada de extremidades internas */}
                    <div className="border border-gray-800 bg-dark-100/30 backdrop-blur-sm divide-y divide-gray-800">
                      <div className="flex items-center gap-4 px-5 py-4 focus-within:bg-white/5 transition-colors">
                        <label className="w-16 shrink-0 text-xs font-bold tracking-widest text-gray-500 uppercase">E-MAIL</label>
                        <input
                          type="email"
                          placeholder="SEU@EMAIL.COM"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-transparent px-0 py-1 text-sm uppercase text-white placeholder-gray-700 outline-none focus:outline-none"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-4 px-5 py-4 focus-within:bg-white/5 transition-colors">
                        <label className="w-16 shrink-0 text-xs font-bold tracking-widest text-gray-500 uppercase">SENHA</label>
                        <div className="relative min-w-0 flex-1">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-transparent px-0 py-1 pr-10 text-sm text-white placeholder-gray-700 outline-none focus:outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 transition-colors hover:text-gray-400"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-primary to-yellow-600 text-black font-black text-sm tracking-wider uppercase rounded-button hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        {loading ? 'ENTRANDO...' : 'ENTRAR NO SISTEMA'}
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(userType === 'client' ? '/cadastro/cliente' : '/cadastro/profissional')}
                        className="w-full rounded-button border border-gray-800 bg-transparent py-4 text-xs font-bold tracking-widest uppercase text-gray-400 transition-all hover:border-primary/50 hover:text-primary"
                      >
                        CRIAR UMA CONTA NOVA
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>

        {/* Rodapé do Painel */}
        <div className="p-6 sm:p-8 border-t border-gray-800 text-center">
          <p className="text-[10px] text-gray-600 font-normal tracking-wider uppercase leading-relaxed">
            Ao continuar, você concorda com nossos{' '}
            <Link to="/termos" className="text-gray-400 hover:text-primary underline underline-offset-2 transition-colors">
              Termos de Uso
            </Link>
          </p>
        </div>
      </div>

      {/* PAINEL DIREITO: Espaço conceitual/branding que resolve o problema do Desktop vazio */}
      <div className="hidden lg:col-span-7 bg-black relative overflow-hidden lg:flex flex-col items-center justify-center p-16">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dark-100/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <ZapIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">SISTEMA INTELIGENTE DE AGENDAMENTO</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase mb-4">
            A CIÊNCIA POR TRÁS DA<br/>
            <span className="bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
              AGENDA SEM BURACOS
            </span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed uppercase tracking-wide">
            O fim da desorganização operacional. Vitrine, equipe, otimização de faturamento e agendamentos fluidos reunidos sob uma única experiência de alta performance.
          </p>
        </div>
        
        {/* Linhas decorativas sutis que simulam o grid infinito ao fundo do lado direito */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gray-800" />
          <div className="absolute top-2/3 left-0 w-full h-px bg-gray-800" />
          <div className="absolute top-0 left-1/3 w-px h-full bg-gray-800" />
          <div className="absolute top-0 left-2/3 w-px h-full bg-gray-800" />
        </div>
      </div>

    </div>
  );
}
