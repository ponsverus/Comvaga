import React, { useEffect, useMemo, useState } from 'react';

function cls(...arr) {
  return arr.filter(Boolean).join(' ');
}

function getScreenClasses(screen) {
  if (screen === 'light') {
    return {
      overlay: 'bg-white',
      title: 'text-black',
      body: 'text-gray-700',
      box: 'bg-white border border-gray-200',
    };
  }
  return {
    overlay: 'bg-black',
    title: 'text-white',
    body: 'text-gray-300',
    box: 'bg-black border border-gray-800',
  };
}

function getVariantClasses(variant) {
  if (variant === 'success') return { accent: 'text-green-500' };
  if (variant === 'danger' || variant === 'error') return { accent: 'text-red-500' };
  if (variant === 'warning') return { accent: 'text-yellow-400' };
  return { accent: 'text-white' };
}

export default function FullScreenMessage({ open, payload, onClose }) {
  const type = payload?.type || 'message';
  const screen = payload?.screen || 'dark';
  const variant = payload?.variant || 'danger';

  const s = useMemo(() => getScreenClasses(screen), [screen]);
  const v = useMemo(() => getVariantClasses(variant), [variant]);

  const [value, setValue] = useState(payload?.initialValue ?? '');

  useEffect(() => {
    if (open) {
      setValue(payload?.initialValue ?? '');
    }
  }, [open, payload?.initialValue]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (type === 'confirm') onClose(false);
        else if (type === 'prompt') onClose(null);
        else onClose(undefined);
      }
      if (e.key === 'Enter') {
        if (type === 'confirm') onClose(true);
        if (type === 'prompt') onClose(String(value ?? ''));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, type, onClose, value]);

  if (!open) return null;

  const title = payload?.title || '';
  const body = payload?.body || '';

  const confirmText = payload?.confirmText || payload?.buttonText || 'OK';
  const cancelText = payload?.cancelText || 'CANCELAR';
  const placeholder = payload?.placeholder || '';

  const okBtn = 'bg-yellow-400 hover:bg-yellow-300 text-black';
  const cancelBtn = screen === 'light'
    ? 'bg-gray-100 hover:bg-gray-200 text-black border border-gray-300'
    : 'bg-dark-200 hover:bg-dark-100 text-white border border-gray-700';

  return (
    <div className={cls('fixed inset-0 z-[9999]', s.overlay, 'flex items-center justify-center p-4')}>
      <div className={cls('w-full max-w-md rounded-custom p-8', s.box)}>
        {!!title && (
          <h2 className={cls('text-2xl font-normal mb-2', s.title, v.accent)}>
            {title}
          </h2>
        )}

        {!!body && (
          <p className={cls('text-base font-normal mb-6 whitespace-pre-wrap', s.body)}>
            {body}
          </p>
        )}

        {type === 'prompt' && (
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={cls(
              'w-full px-4 py-3 rounded-custom mb-6 outline-none',
              screen === 'light'
                ? 'bg-white border border-gray-300 text-black'
                : 'bg-dark-200 border border-gray-800 text-white'
            )}
          />
        )}

        {type === 'message' && (
          <button
            onClick={() => onClose(undefined)}
            className={cls('w-full py-3 rounded-button font-normal uppercase', okBtn)}
          >
            {payload?.buttonText || 'OK'}
          </button>
        )}

        {type === 'confirm' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onClose(false)}
              className={cls('w-full py-3 rounded-button font-normal uppercase', cancelBtn)}
            >
              {cancelText}
            </button>
            <button
              onClick={() => onClose(true)}
              className={cls('w-full py-3 rounded-button font-normal uppercase', okBtn)}
            >
              {confirmText}
            </button>
          </div>
        )}

        {type === 'prompt' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onClose(null)}
              className={cls('w-full py-3 rounded-button font-normal uppercase', cancelBtn)}
            >
              {cancelText}
            </button>
            <button
              onClick={() => onClose(String(value ?? ''))}
              className={cls('w-full py-3 rounded-button font-normal uppercase', okBtn)}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
