import { useCallback, useMemo } from 'react';

import { ptBR } from './messages/ptBR.js';
import { getFeedbackState, setFeedbackState } from './feedbackStore';

function getByPath(obj, path) {
  const parts = String(path || '').split('.');
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== 'object') return null;
    cur = cur[p];
  }
  return cur || null;
}

function interpolate(str, params) {
  return String(str || '').replace(/\{(\w+)\}/g, (_, k) => {
    const v = params?.[k];
    return (v === undefined || v === null) ? '' : String(v);
  });
}

function buildPayloadFromKey(key, params) {
  const base = getByPath(ptBR, key);
  if (!base) {
    return {
      title: 'Aviso',
      body: `Mensagem não encontrada: ${key}`,
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    };
  }

  return {
    ...base,
    title: interpolate(base.title, params),
    body: interpolate(base.body, params),
  };
}

export function useFeedback() {
  const showMessage = useCallback((key, params) => {
    const payload = buildPayloadFromKey(key, params);

    setFeedbackState({
      open: true,
      payload: {
        ...payload,
        type: 'message',
      },
    });
  }, []);

  const confirm = useCallback((key, { params, variant } = {}) => {
    const payload = buildPayloadFromKey(key, params);

    return new Promise((resolve) => {
      setFeedbackState({
        open: true,
        payload: {
          ...payload,
          type: 'confirm',
          variant: variant || payload.variant || 'warning',
          confirmText: payload.confirmText || payload.buttonText || 'OK',
          cancelText: payload.cancelText || 'CANCELAR',
          __resolve: resolve,
        },
      });
    });
  }, []);

  const prompt = useCallback((key, { params, variant, placeholder = '', initialValue = '' } = {}) => {
    const payload = buildPayloadFromKey(key, params);

    return new Promise((resolve) => {
      setFeedbackState({
        open: true,
        payload: {
          ...payload,
          type: 'prompt',
          variant: variant || payload.variant || 'warning',
          placeholder: payload.placeholder || placeholder,
          initialValue: payload.initialValue ?? initialValue,
          confirmText: payload.confirmText || payload.buttonText || 'OK',
          cancelText: payload.cancelText || 'CANCELAR',
          __resolve: resolve,
        },
      });
    });
  }, []);

  const showCustom = useCallback((payload) => {
    setFeedbackState({ open: true, payload: { ...payload, type: payload?.type || 'message' } });
  }, []);

  const close = useCallback((result) => {
    const cur = getFeedbackState();
    const resolver = cur?.payload?.__resolve;
    const onClose = cur?.payload?.onClose;

    setFeedbackState({ open: false, payload: null });

    if (typeof resolver === 'function') resolver(result);
    if (typeof onClose === 'function') onClose();
  }, []);

  return useMemo(
    () => ({ showMessage, confirm, prompt, showCustom, close }),
    [showMessage, confirm, prompt, showCustom, close]
  );
}
