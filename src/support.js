export const SUPPORT_PHONE_E164 = '5533999037979';

export const SUPPORT_MESSAGES = {
  client: 'Ola, sou cliente da Comvaga e preciso de ajuda. Pode me ajudar?',
  professional: 'Ola, sou profissional da Comvaga e preciso de suporte. Pode me ajudar?',
  public: 'Ola, gostaria de tirar uma duvida sobre a Comvaga. Pode me ajudar?',
};

export function buildWhatsAppHref(message) {
  return `https://wa.me/${SUPPORT_PHONE_E164}?text=${encodeURIComponent(message)}`;
}

export function getSupportHref(userType = null) {
  return buildWhatsAppHref(SUPPORT_MESSAGES[userType] || SUPPORT_MESSAGES.public);
}

export const SUPPORT_HREF = getSupportHref();
