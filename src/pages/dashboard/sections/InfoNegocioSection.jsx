import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import TemaToggle from '../components/TemaToggle';
import { ptBR } from '../../../feedback/messages/ptBR';
import { isEnderecoPadrao } from '../utils';

function InfoRow({ label, children, action, last = false }) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 sm:px-6 ${last ? '' : 'border-b border-gray-800'}`}>
      <span className="w-[86px] shrink-0 py-2 text-[14px] leading-5 text-gray-500">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
      {action}
    </div>
  );
}

const inputClass = 'w-full bg-transparent px-0 py-2 text-[14px] text-white placeholder-gray-600 outline-none focus:text-white';
const pillInputClass = 'w-full rounded-full border border-gray-800 bg-transparent px-4 py-2 text-center text-[14px] text-white placeholder-gray-600 outline-none focus:border-primary/50 focus:text-white';
const saveButtonClass = 'shrink-0 rounded-full border border-primary/30 px-3 py-1 text-[12px] font-normal uppercase text-primary disabled:opacity-50';
const maskedPrivateValue = '••••••••';

export default function InfoNegocioSection({
  nomePerfil,
  setNomePerfil,
  savingPerfil,
  salvarNomePerfil,
  salvarInfoNegocio,
  infoSaving,
  formInfo,
  setFormInfo,
  salvarTema,
  temaSaving,
  galleryUploading,
  uploadGaleria,
  galeriaItems,
  galeriaHasMore,
  galeriaLoadingMore,
  loadMoreGaleria,
  getPublicUrl,
  removerImagemGaleria,
  novoEmail,
  setNovoEmail,
  savingDados,
  salvarEmail,
  novaSenha,
  setNovaSenha,
  confirmarSenha,
  setConfirmarSenha,
  salvarSenha,
  deletingBusiness,
  excluirNegocio,
  navigate,
}) {
  const [sobreExpanded, setSobreExpanded] = useState(false);
  const [visiblePrivateFields, setVisiblePrivateFields] = useState({
    instagram: false,
    facebook: false,
    email: false,
  });
  const [savingBusinessField, setSavingBusinessField] = useState(null);
  const [savingAccountField, setSavingAccountField] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const gallerySentinelRef = useRef(null);
  const addressErrorMessage = ptBR?.dashboard?.address_format_invalid_inline?.body || 'Use o formato: RUA, NUMERO - CIDADE, ESTADO.';

  useEffect(() => {
    const node = gallerySentinelRef.current;
    if (!node || !galeriaHasMore || galeriaLoadingMore || typeof loadMoreGaleria !== 'function') return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadMoreGaleria();
    }, { rootMargin: '600px 0px' });

    observer.observe(node);
    return () => observer.disconnect();
  }, [galeriaHasMore, galeriaLoadingMore, loadMoreGaleria]);

  const revealPrivateField = (field) => {
    setVisiblePrivateFields((current) => ({ ...current, [field]: true }));
  };

  const hidePrivateField = (field) => {
    setVisiblePrivateFields((current) => ({ ...current, [field]: false }));
  };

  const saveBusinessField = async (field) => {
    try {
      setSavingBusinessField(field);
      if (field === 'endereco') {
        const endereco = String(formInfo.endereco || '').trim();
        if (endereco && !isEnderecoPadrao(endereco)) {
          setFieldErrors((prev) => ({ ...prev, endereco: true }));
          await Promise.resolve(salvarInfoNegocio());
          return;
        }
        setFieldErrors((prev) => ({ ...prev, endereco: false }));
      }
      await Promise.resolve(salvarInfoNegocio());
      if (field === 'instagram' || field === 'facebook') hidePrivateField(field);
    } finally {
      setSavingBusinessField(null);
    }
  };

  const saveEmailPrivateField = async () => {
    try {
      setSavingAccountField('email');
      await Promise.resolve(salvarEmail());
      hidePrivateField('email');
    } finally {
      setSavingAccountField(null);
    }
  };

  const savePasswordField = async () => {
    try {
      setSavingAccountField('password');
      await Promise.resolve(salvarSenha());
    } finally {
      setSavingAccountField(null);
    }
  };

  const businessSaveAction = (field) => (
    <button type="button" onClick={() => saveBusinessField(field)} disabled={infoSaving} className={saveButtonClass}>
      {savingBusinessField === field ? 'SALVANDO' : 'SALVAR'}
    </button>
  );

  const privateBusinessAction = (field) => (
    visiblePrivateFields[field] ? (
      <button type="button" onClick={() => saveBusinessField(field)} disabled={infoSaving} className={saveButtonClass}>
        {savingBusinessField === field ? 'SALVANDO' : 'SALVAR'}
      </button>
    ) : (
      <button type="button" onClick={() => revealPrivateField(field)} className={saveButtonClass}>
        VER ID
      </button>
    )
  );

  const privateEmailAction = (
    visiblePrivateFields.email ? (
      <button type="button" disabled={savingDados} onClick={saveEmailPrivateField} className={saveButtonClass}>
        {savingAccountField === 'email' ? 'SALVANDO' : 'SALVAR'}
      </button>
    ) : (
      <button type="button" onClick={() => revealPrivateField('email')} className={saveButtonClass}>
        VER E-MAIL
      </button>
    )
  );

  return (
    <div className="-m-6">
      <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-3 sm:px-6">
        <span className="w-[86px] shrink-0 text-[14px] leading-5 text-gray-500">TEMA</span>
        <div className="min-w-0 flex-1">
          <TemaToggle value={formInfo.tema} onChange={salvarTema} loading={temaSaving} />
        </div>
        <span className="shrink-0 text-[12px] uppercase text-gray-600">
          {temaSaving ? 'SALVANDO' : ''}
        </span>
      </div>

      <InfoRow
        label="ADMIN"
        action={(
          <button type="button" onClick={salvarNomePerfil} disabled={savingPerfil} className={saveButtonClass}>
            {savingPerfil ? 'SALVANDO' : 'SALVAR'}
          </button>
        )}
      >
        <input
          value={nomePerfil}
          onChange={(e) => setNomePerfil(e.target.value)}
          className={`${inputClass} uppercase truncate pr-10 sm:pr-0`}
          placeholder="NOME COMPLETO"
        />
      </InfoRow>

      <InfoRow label="NEGÓCIO" action={businessSaveAction('nome')}>
        <input
          value={formInfo.nome}
          onChange={(e) => setFormInfo((prev) => ({ ...prev, nome: e.target.value }))}
          className={`${inputClass} uppercase truncate pr-10 sm:pr-0`}
          placeholder="NOME DO NEGÓCIO"
        />
      </InfoRow>

      <InfoRow label="TELEFONE" action={businessSaveAction('telefone')}>
        <input
          value={formInfo.telefone}
          onChange={(e) => setFormInfo((prev) => ({ ...prev, telefone: e.target.value }))}
          className={inputClass}
          placeholder="CONTATO"
        />
      </InfoRow>

      <InfoRow label="ENDERE." action={businessSaveAction('endereco')}>
        {fieldErrors.endereco ? (
          <p className="mb-1 text-xs leading-4 text-red-400">{addressErrorMessage}</p>
        ) : null}
        <input
          value={formInfo.endereco}
          onChange={(e) => {
            setFieldErrors((prev) => ({ ...prev, endereco: false }));
            setFormInfo((prev) => ({ ...prev, endereco: e.target.value }));
          }}
          className={`${inputClass} max-w-[calc(100vw-13.75rem)] truncate border-b pr-4 sm:max-w-none sm:pr-0 ${fieldErrors.endereco ? 'border-red-500 text-red-200 focus:border-red-400' : 'border-transparent'}`}
          aria-invalid={fieldErrors.endereco ? 'true' : 'false'}
          placeholder="RUA, NÚMERO - CIDADE, ESTADO"
        />
      </InfoRow>

      <div className="border-b border-gray-800 px-4 py-3 sm:px-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[14px] leading-5 text-gray-500">SOBRE</span>
          {sobreExpanded ? (
            <button type="button" onClick={() => saveBusinessField('descricao')} disabled={infoSaving} className={saveButtonClass}>
              {savingBusinessField === 'descricao' ? 'SALVANDO' : 'SALVAR'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSobreExpanded(true)}
              className="shrink-0 rounded-full border border-primary/30 p-0.5 text-primary hover:border-primary"
              aria-label="Abrir sobre o negocio"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </div>
        {sobreExpanded ? (
        <textarea
          value={formInfo.descricao}
          onChange={(e) => setFormInfo((prev) => ({ ...prev, descricao: e.target.value }))}
          rows={4}
          className="max-h-32 w-full resize-none overflow-y-auto bg-transparent py-2 pl-0 pr-6 text-[14px] font-normal leading-5 text-white outline-none [scrollbar-width:none] placeholder-gray-600 focus:text-white sm:pr-0 [&::-webkit-scrollbar]:hidden"
          placeholder="Conte sobre seu negócio, atendimento e diferenciais"
        />
        ) : null}
      </div>

      <InfoRow label="INSTAGRAM" action={privateBusinessAction('instagram')}>
        <input
          type="text"
          value={visiblePrivateFields.instagram ? formInfo.instagram : maskedPrivateValue}
          onChange={(e) => setFormInfo((prev) => ({ ...prev, instagram: e.target.value }))}
          readOnly={!visiblePrivateFields.instagram}
          className={inputClass}
          placeholder="@BARBEARIATORRES"
        />
      </InfoRow>

      <InfoRow label="FACEBOOK" action={privateBusinessAction('facebook')}>
        <input
          type="text"
          value={visiblePrivateFields.facebook ? formInfo.facebook : maskedPrivateValue}
          onChange={(e) => setFormInfo((prev) => ({ ...prev, facebook: e.target.value }))}
          readOnly={!visiblePrivateFields.facebook}
          className={inputClass}
          placeholder="EX: BARBEARIA-TORRES"
        />
      </InfoRow>

      <div className="border-b border-gray-800 py-4">
        <div className="mb-4 flex items-center justify-between gap-4 px-4 sm:px-6">
          <span className="text-[14px] text-gray-400">GALERIA</span>
          <label>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadGaleria(e.target.files)} disabled={galleryUploading} />
            <span className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-[12px] uppercase ${galleryUploading ? 'border-gray-800 text-gray-600' : 'border-primary/30 text-primary'}`}>
              <Plus className="h-3.5 w-3.5" />
              {galleryUploading ? 'ENVIANDO' : 'ADICIONAR'}
            </span>
          </label>
        </div>

        {galeriaItems.length > 0 ? (
          <>
            <div className="columns-2 gap-1 lg:columns-3">
              {galeriaItems.map((item) => (
                <div key={item.id || item.path} className="relative mb-1 w-full break-inside-avoid overflow-hidden rounded-custom border border-gray-800 bg-dark-200">
                  <img src={getPublicUrl('galerias', item.path)} alt="Galeria" className="h-auto w-full object-contain" loading="lazy" />
                  <button type="button" onClick={() => removerImagemGaleria(item)} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-700 bg-black/60 px-3 py-1 text-[12px] font-normal uppercase text-red-200 hover:border-red-400 sm:left-auto sm:right-2 sm:top-2 sm:translate-x-0 sm:translate-y-0">
                    REMOVER
                  </button>
                </div>
              ))}
            </div>

            {galeriaHasMore ? (
              <div ref={gallerySentinelRef} className="flex h-12 items-center justify-center" aria-hidden="true">
                {galeriaLoadingMore ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-800 border-t-primary" /> : null}
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <InfoRow
        label="E-MAIL"
        action={privateEmailAction}
      >
        <input
          type={visiblePrivateFields.email ? 'email' : 'text'}
          value={visiblePrivateFields.email ? novoEmail : maskedPrivateValue}
          onChange={(e) => setNovoEmail(e.target.value)}
          readOnly={!visiblePrivateFields.email}
          className={`${inputClass} uppercase max-w-[calc(100vw-13.75rem)] truncate pr-4 sm:max-w-none sm:pr-0`}
        />
      </InfoRow>

      <div className="border-b border-gray-800 px-4 py-3 sm:px-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[14px] leading-5 text-gray-500">SENHA</span>
          <button type="button" disabled={savingDados} onClick={savePasswordField} className="shrink-0 rounded-full border border-green-500/40 px-3 py-1 text-[12px] font-normal uppercase text-green-300 disabled:opacity-50">
            {savingAccountField === 'password' ? 'SALVANDO' : 'SALVAR'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className={pillInputClass}
            placeholder="NOVA SENHA"
          />
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className={pillInputClass}
            placeholder="CONFIRMAR"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <button type="button" onClick={() => navigate('/criar-negocio')} className="flex-1 rounded-button border border-primary/30 py-3 text-[12px] font-normal uppercase text-primary hover:border-primary">
          CRIAR OUTRO
        </button>
        <button
          type="button"
          onClick={excluirNegocio}
          disabled={deletingBusiness}
          className="flex-1 rounded-button border border-red-500/30 py-3 text-[12px] font-normal uppercase text-red-400 disabled:opacity-50"
        >
          {deletingBusiness ? 'EXCLUINDO' : 'EXCLUIR'}
        </button>
      </div>
    </div>
  );
}
