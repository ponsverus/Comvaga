import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { formatHorariosResumo, normalizeKey, normalizeProfissionalHorarios, STATUS_COLOR_CLASS } from '../utils';

function buildProfissionalForm(p) {
  return {
    nome: p.nome || '',
    profissao: p.profissao || '',
    anos_experiencia: String(p.anos_experiencia ?? ''),
    horarios: normalizeProfissionalHorarios(p),
  };
}

export default function ProfissionaisSection({
  souDono,
  currentUserId,
  adminJaEhProfissional,
  cadastrarAdminComoProfissional,
  submittingAdminProf,
  profissionais,
  parceiroProfissional,
  entregas,
  counterPlural,
  aprovarParceiro,
  excluirProfissional,
  toggleStatusProfissional,
  setEditingProfissionalId,
  setFormProfissional,
  setShowEditProfissional,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-normal">Profissionais</h2>
        {souDono && !adminJaEhProfissional && (
          <button
            onClick={cadastrarAdminComoProfissional}
            disabled={submittingAdminProf}
            className={`flex items-center gap-2 px-4 py-2 rounded-button text-sm font-normal uppercase border transition-all ${submittingAdminProf ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed' : 'bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary'}`}
          >
            <Plus className="w-4 h-4" />
            {submittingAdminProf ? 'CADASTRANDO...' : 'ME CADASTRAR'}
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {profissionais.map((p) => {
          const isPendente = p.status === 'pendente';
          const isInativo = p.status === 'inativo';
          const isAtivo = p.status === 'ativo';
          const label = normalizeKey(p.status_label);
          const dotClass = STATUS_COLOR_CLASS[label] || 'bg-gray-500';
          const statusLabelView = label === 'ALMOCO' ? 'PAUSA' : p.status_label;
          const isEuMesmo = parceiroProfissional?.id === p.id;
          const isAdminOwnProfessionalCard = souDono && p.user_id && p.user_id === currentUserId;
          const horarios = normalizeProfissionalHorarios(p);
          const openEditor = () => {
            setEditingProfissionalId(p.id);
            setFormProfissional(buildProfissionalForm(p));
            setShowEditProfissional(true);
          };

          return (
            <div key={p.id} className={`relative bg-dark-200 border rounded-custom p-5 ${isPendente ? 'border-yellow-500/40' : isEuMesmo ? 'border-primary/30' : 'border-gray-800'}`}>
              {isPendente && (
                <div className="absolute top-3 right-3 text-[10px] px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-normal uppercase">AGUARDANDO</div>
              )}
              {!isPendente && isInativo && (
                <span className="absolute top-3 right-3 text-[10px] px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 font-normal uppercase">INATIVO</span>
              )}

              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-yellow-600 rounded-custom flex items-center justify-center font-normal text-xl shrink-0">{p.nome?.[0] || 'P'}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-normal pr-24">{p.nome}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isPendente ? 'bg-yellow-400' : dotClass}`} />
                    <span className={`text-xs ${isPendente ? 'text-yellow-400' : 'text-gray-400'}`}>{isPendente ? 'PENDENTE' : (statusLabelView || '-')}</span>
                  </div>
                  {p.profissao && <p className="text-xs text-gray-500 mt-1">{p.profissao}</p>}
                  {!isPendente && p.anos_experiencia != null && (
                    <p className="text-xs text-gray-500 mt-1">{p.anos_experiencia} ANOS DE EXPERIÊNCIA</p>
                  )}
                </div>
              </div>

              {!isPendente && (
                <>
                  <div className="text-sm text-gray-400 mb-3">{entregas.filter((s) => s.profissional_id === p.id).length} {counterPlural}</div>
                  <div className="text-xs text-gray-500 mb-3">
                    <Clock className="w-4 h-4 inline mr-1" />{formatHorariosResumo(horarios)}
                  </div>
                </>
              )}

              {isPendente && souDono && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => aprovarParceiro(p)} className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 rounded-button text-sm font-normal uppercase">APROVAR</button>
                  <button onClick={() => excluirProfissional(p)} className="flex-1 py-2 bg-red-500/10 border border-red-500/30 text-red-300 rounded-button text-sm font-normal uppercase">EXCLUIR</button>
                </div>
              )}

              {!isPendente && (isEuMesmo || souDono) && (
                <>
                  {isInativo && p.motivo_inativo && (
                    <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-custom p-2 mb-3">
                      INATIVO {p.motivo_inativo ? `- ${p.motivo_inativo}` : ''}
                    </div>
                  )}
                  {souDono ? (
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-2">
                        <button onClick={() => toggleStatusProfissional(p)} className={`flex-1 py-2 rounded-button text-sm border font-normal uppercase ${isAtivo ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-green-500/10 border-green-500/30 text-green-300'}`}>
                          {isAtivo ? 'INATIVAR' : 'ATIVAR'}
                        </button>
                        {!isAdminOwnProfessionalCard && (
                          <button onClick={() => excluirProfissional(p)} className="flex-1 py-2 bg-red-500/10 border border-red-500/30 text-red-300 rounded-button text-sm font-normal uppercase">EXCLUIR</button>
                        )}
                      </div>
                      <button onClick={openEditor} className="w-full py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-button text-sm font-normal uppercase">EDITAR</button>
                    </div>
                  ) : isEuMesmo ? (
                    <button onClick={openEditor} className="w-full py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-button text-sm font-normal uppercase">EDITAR</button>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
