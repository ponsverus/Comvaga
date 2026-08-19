export function normalizeBrazilPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';

  let d = digits;
  if (d.startsWith('55') && (d.length === 12 || d.length === 13)) {
    d = d.slice(2);
  }

  if (d.length !== 10 && d.length !== 11) return null;

  return `+55${d}`;
}

function onlyDigits(e164) {
  return String(e164 || '').replace(/\D/g, '');
}

export function formatPhoneForDisplay(e164) {
  const digits = onlyDigits(e164);
  return digits.startsWith('55') ? digits.slice(2) : digits;
}

export function formatPhoneForWhatsAppLink(e164) {
  return onlyDigits(e164);
}
