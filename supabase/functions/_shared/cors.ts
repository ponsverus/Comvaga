const defaultOrigin = 'https://comvaga.com.br';
const allowedOrigins = new Set([
  defaultOrigin,
  'https://www.comvaga.com.br',
]);

export function getCorsHeaders(req?: Request) {
  const origin = req?.headers.get('origin') || '';
  const allowedOrigin = allowedOrigins.has(origin) ? origin : defaultOrigin;

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, asaas-access-token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

export const corsHeaders = getCorsHeaders();

export function jsonResponse(body: unknown, status = 200, req?: Request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json',
    },
  });
}
