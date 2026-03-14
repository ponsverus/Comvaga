/**
 * businessTerms.js
 *
 * Mapeia tipo_negocio → grupo de vocabulário.
 * 4 grupos fixos: 'servicos' | 'consultas' | 'aulas' | 'default'
 *
 * Uso no front:
 *   import { getBusinessGroup } from '../businessTerms';
 *   const group = getBusinessGroup(negocio?.tipo_negocio);
 *   // → 'servicos' | 'consultas' | 'aulas' | 'default'
 *
 *   // Título da aba no dashboard:
 *   ptBR.dashboard.business.tab_title[group]   // ex.: "Serviços"
 *
 *   // Alerta dinâmico:
 *   ptBR.dashboard.business[group].service_created
 *   ptBR.vitrine.business[group].schedule_need_one_service
 */

function _norm(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const TIPO_PARA_GRUPO = {
  // — SERVIÇOS —
  barbearia:              'servicos',
  s. de beleza:           'servicos',
  cabeleireiro:           'servicos',
  m. e pedicure:          'servicos',
  e. tatuagem:            'servicos',
  estetica:               'servicos',
  spa:                    'servicos',

  // — CONSULTAS —
  c. medica:              'consultas',
  dentista:               'consultas',
  nutricao:               'consultas',
  nutricionista:          'consultas',
  c.veterinaria:          'consultas',
  psicologo:              'consultas',
  psicologia:             'consultas',
  psiquiatra:             'consultas',
  psiquiatria:            'consultas',
  fisioterapeuta:         'consultas',
  fisioterapia:           'consultas',
  fonoaudiologo:          'consultas',
  fonoaudiologia:         'consultas',
  terapeuta:              'consultas',
  terapia:                'consultas',
  dermatologista:         'consultas',
  dermatologia:           'consultas',

  // — AULAS —
  personal:               'aulas',
  'personal trainer':     'aulas',
  academia:               'aulas',
  pilates:                'aulas',
  yoga:                   'aulas',
  danca:                  'aulas',
  musica:                 'aulas',
  idioma:                 'aulas',
  'escola de idiomas':    'aulas',
  natacao:                'aulas',
  crossfit:               'aulas',
  ginastica:              'aulas',
};

/**
 * Retorna o grupo de vocabulário para um tipo de negócio.
 * Match exato → parcial → 'default'.
 */
export function getBusinessGroup(tipoNegocio) {
  const key = _norm(tipoNegocio);
  if (!key) return 'default';

  if (TIPO_PARA_GRUPO[key]) return TIPO_PARA_GRUPO[key];

  const match = Object.keys(TIPO_PARA_GRUPO).find(
    k => key.includes(k) || k.includes(key)
  );
  return match ? TIPO_PARA_GRUPO[match] : 'default';
}
