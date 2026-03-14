/**
 * businessTerms.js
 *
 * Mapeia tipo_negocio → grupo de vocabulário.
 * 3 grupos: 'servicos' | 'consultas' | 'aulas'
 *
 * As chaves deste mapa são os valores NORMALIZADOS pelo banco
 * via normalize_tipo_negocio() + trigger trg_fn_normalize_tipo_negocio.
 * Ou seja, o banco sempre grava em caixa alta canônica antes de salvar.
 * A função _norm() aqui faz o mesmo tratamento para comparação segura.
 *
 * Uso no front:
 *   import { getBusinessGroup } from '../businessTerms';
 *   const group = getBusinessGroup(negocio?.tipo_negocio);
 *   // → 'servicos' | 'consultas' | 'aulas'
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

// Chaves = valores canônicos gravados pelo banco (normalize_tipo_negocio),
// normalizados aqui via _norm() para comparação segura.
const TIPO_PARA_GRUPO = {
  // ── SERVIÇOS ──────────────────────────────────────────────────────────
  'barbearia':      'servicos',
  's. de beleza':   'servicos',
  'cabeleireiro':   'servicos',
  'm. e pedicure':  'servicos',
  'e. tatuagem':    'servicos',
  'estetica':       'servicos',
  'spa':            'servicos',

  // ── CONSULTAS ─────────────────────────────────────────────────────────
  'c. medica':      'consultas',
  'dentista':       'consultas',
  'nutricao':       'consultas',
  'c.veterinaria':  'consultas',
  'psicologia':     'consultas',
  'fisioterapia':   'consultas',
  'fonoaudiologia': 'consultas',
  'terapia':        'consultas',
  'dermatologia':   'consultas',

  // ── AULAS ─────────────────────────────────────────────────────────────
  'p. trainer':     'aulas',
  'academia':       'aulas',
  'pilates':        'aulas',
  'yoga':           'aulas',
  'danca':          'aulas',
  'musica':         'aulas',
  'idiomas':        'aulas',
  'natacao':        'aulas',
  'crossfit':       'aulas',
  'ginastica':      'aulas',
};

/**
 * Retorna o grupo de vocabulário para um tipo de negócio.
 * Match exato (após normalização) → parcial → 'servicos' (fallback).
 */
export function getBusinessGroup(tipoNegocio) {
  const key = _norm(tipoNegocio);
  if (!key) return 'servicos';
  if (TIPO_PARA_GRUPO[key]) return TIPO_PARA_GRUPO[key];
  const match = Object.keys(TIPO_PARA_GRUPO).find(
    k => key.includes(k) || k.includes(key)
  );
  return match ? TIPO_PARA_GRUPO[match] : 'servicos';
}
