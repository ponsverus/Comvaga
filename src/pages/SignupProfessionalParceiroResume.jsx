import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupProfessionalParceiroResume({ user, onLogin }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      onLogin?.(user, 'professional', 'pending', 'active', 'partner', 'partner');
    }
    navigate('/selecionar-negocio-parceiro', { replace: true });
  }, [navigate, onLogin, user]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <div className="text-primary text-xl">CARREGANDO...</div>
      </div>
    </div>
  );
}
