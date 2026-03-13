/**
 * BookingCalendar.jsx
 * Calendário de agendamento para uso na Vitrine.
 *
 * Props:
 *   profissional     — objeto profissional (id, dias_trabalho, horario_inicio, horario_fim, etc.)
 *   entrega          — objeto entrega selecionada (id, duracao_minutos, nome, preco, preco_promocional)
 *   todayISO         — string "YYYY-MM-DD" vindo do serverNow.date (now_sp) — âncora do banco
 *   onConfirm        — (slot: { inicio, fim, label, dataISO }) => void  — chamado ao confirmar
 *   onClose          — () => void — chamado ao fechar/cancelar
 *   negocioId        — uuid do negócio (para inserir o agendamento)
 *   clienteId        — uuid do cliente logado
 *
 * Fluxo:
 *   1. Usuário navega pelo calendário → dias bloqueados pelo banco (dias_trabalho + passado)
 *   2. Ao clicar num dia disponível → busca slots via rpc_get_slots_v4
 *   3. Usuário seleciona um slot → mostra resumo → confirma
 *   4. onConfirm é chamado com os dados do slot + data selecionada
 *
 * NUNCA usa o horário do device. Tudo ancorado em todayISO (now_sp).
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Clock, Check, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

// ─── helpers de data ─────────────────────────────────────────────────────────

function parseISO(iso) {
  if (!iso) return null;
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m, day: d };
}

function toISO(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDisplayBR(iso) {
  const p = parseISO(iso);
  if (!p) return '';
  return `${String(p.day).padStart(2, '0')}/${String(p.month).padStart(2, '0')}/${p.year}`;
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function firstDayOfMonth(year, month) {
  return new Date(year, month - 1, 1).getDay(); // 0=dom
}

// Compara dois ISO sem criar Date (seguro de fuso)
function isoLt(a, b) { return String(a) < String(b); }
function isoEq(a, b) { return String(a) === String(b); }

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// ─── sub-componente: grade do calendário ──────────────────────────────────────

function CalendarGrid({ viewYear, viewMonth, todayISO, selectedISO, diasTrabalho, onSelectDay }) {
  const totalDays = daysInMonth(viewYear, viewMonth);
  const startDow  = firstDayOfMonth(viewYear, viewMonth);

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <div className="w-full">
      {/* labels dos dias da semana */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((l, i) => (
          <div key={i} className="text-center text-[10px] text-gray-500 uppercase py-1 select-none">{l}</div>
        ))}
      </div>

      {/* grade */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;

          const iso   = toISO(viewYear, viewMonth, day);
          const dow   = (startDow + day - 1) % 7;
          const isPast        = isoLt(iso, todayISO);
          const isToday       = isoEq(iso, todayISO);
          const isWorkday     = Array.isArray(diasTrabalho) && diasTrabalho.includes(dow);
          const isSelected    = selectedISO && isoEq(iso, selectedISO);
          const isDisabled    = isPast || !isWorkday;

          return (
            <button
              key={day}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelectDay(iso)}
              className={`
                h-9 w-full rounded text-sm font-normal transition-colors select-none
                ${isSelected
                  ? 'bg-primary text-black font-normal'
                  : isToday && !isDisabled
                    ? 'text-primary font-normal'
                    : isDisabled
                      ? 'text-gray-700 cursor-not-allowed'
                      : 'text-gray-300 hover:bg-dark-200 hover:text-white cursor-pointer'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── componente principal ─────────────────────────────────────────────────────

export default function BookingCalendar({
  profissional,
  entrega,
  todayISO,
  onConfirm,
  onClose,
  negocioId,
  clienteId,
}) {
  const today = parseISO(todayISO);

  const [viewYear,  setViewYear]  = useState(today?.year  ?? new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(today?.month ?? (new Date().getMonth() + 1));

  const [selectedDay,  setSelectedDay]  = useState(null);   // ISO string
  const [slots,        setSlots]        = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError,   setSlotsError]   = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);   // objeto slot
  const [confirming,   setConfirming]   = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  const containerRef = useRef(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  // Quando o dia muda → busca slots
  const fetchSlots = useCallback(async (dayISO) => {
    if (!profissional?.id || !entrega?.duracao_minutos || !dayISO) return;
    setSlotsLoading(true);
    setSlotsError(null);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const { data, error } = await supabase.rpc('rpc_get_slots_v4', {
        p_profissional_id: profissional.id,
        p_dia:             dayISO,
        p_entrega_min:     entrega.duracao_minutos,
        p_folga_min:       5,
        p_margem_min:      5,
        p_modo:            'todos',
      });
      if (error) throw error;
      setSlots(data || []);
      if (!data || data.length === 0) setSlotsError('Nenhum horário disponível neste dia.');
    } catch (e) {
      console.error('fetchSlots error:', e);
      setSlotsError('Erro ao buscar horários. Tente outro dia.');
    } finally {
      setSlotsLoading(false);
    }
  }, [profissional?.id, entrega?.duracao_minutos]);

  const handleSelectDay = (iso) => {
    setSelectedDay(iso);
    setSelectedSlot(null);
    fetchSlots(iso);
  };

  const handleConfirm = async () => {
    if (!selectedSlot || !selectedDay || !clienteId || !negocioId) return;
    setConfirming(true);
    setConfirmError(null);
    try {
      // Extrai HH:MM do timestamptz retornado pelo banco
      const toTime = (ts) => {
        const d = new Date(ts);
        // Converte para horário de SP manualmente via Intl
        const parts = new Intl.DateTimeFormat('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          hour: '2-digit', minute: '2-digit', hour12: false,
        }).formatToParts(d);
        const h = parts.find(p => p.type === 'hour')?.value ?? '00';
        const m = parts.find(p => p.type === 'minute')?.value ?? '00';
        return `${h}:${m}`;
      };

      const horario_inicio = toTime(selectedSlot.inicio);
      const horario_fim    = toTime(selectedSlot.fim);

      const preco_final = entrega.preco_promocional
        ? Number(entrega.preco_promocional)
        : Number(entrega.preco);

      const { error } = await supabase.from('agendamentos').insert([{
        negocio_id:      negocioId,
        profissional_id: profissional.id,
        cliente_id:      clienteId,
        entrega_id:      entrega.id,
        data:            selectedDay,
        horario_inicio,
        horario_fim,
        status:          'agendado',
        preco_final,
      }]);

      if (error) throw error;

      onConfirm?.({
        inicio:  selectedSlot.inicio,
        fim:     selectedSlot.fim,
        label:   selectedSlot.label,
        dataISO: selectedDay,
      });
    } catch (e) {
      console.error('handleConfirm error:', e);
      setConfirmError('Não foi possível confirmar. Tente novamente.');
    } finally {
      setConfirming(false);
    }
  };

  function prevMonth() {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  }

  // Impede navegar para mês anterior ao atual (segundo o banco)
  const canGoPrev = !(viewYear === today?.year && viewMonth === today?.month);

  const diasTrabalho = profissional?.dias_trabalho ?? [1, 2, 3, 4, 5, 6];

  const valorExibido = entrega?.preco_promocional
    ? Number(entrega.preco_promocional).toFixed(2)
    : Number(entrega?.preco ?? 0).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div
        ref={containerRef}
        className="bg-dark-100 border border-gray-800 rounded-custom w-full max-w-md max-h-[92vh] overflow-y-auto"
      >
        {/* ── cabeçalho ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-800">
          <div className="min-w-0">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Agendamento</div>
            <div className="font-normal text-white truncate">{entrega?.nome}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              {profissional?.nome}
              {entrega?.duracao_minutos && <span className="ml-2 text-gray-600">• {entrega.duracao_minutos} min</span>}
              <span className="ml-2 text-primary">• R$ {valorExibido}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 ml-4 p-1.5 rounded-button text-gray-500 hover:text-white hover:bg-dark-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* ── navegação de mês ── */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrev}
              className="p-1.5 rounded hover:bg-dark-200 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm font-normal text-white uppercase tracking-wide select-none">
              {MONTH_NAMES[viewMonth - 1]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded hover:bg-dark-200 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ── grade ── */}
          <CalendarGrid
            viewYear={viewYear}
            viewMonth={viewMonth}
            todayISO={todayISO}
            selectedISO={selectedDay}
            diasTrabalho={diasTrabalho}
            onSelectDay={handleSelectDay}
          />

          {/* ── legenda ── */}
          <div className="flex items-center gap-4 mt-4 text-[11px] text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              disponível
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-700 inline-block" />
              indisponível
            </span>
          </div>

          {/* ── slots ── */}
          {selectedDay && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400 uppercase tracking-wide">
                  Horários — {formatDisplayBR(selectedDay)}
                </span>
              </div>

              {slotsLoading && (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span className="text-sm">Buscando horários...</span>
                </div>
              )}

              {!slotsLoading && slotsError && (
                <div className="py-6 text-center text-sm text-gray-500">{slotsError}</div>
              )}

              {!slotsLoading && !slotsError && slots.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot, idx) => {
                    const isSelected = selectedSlot?.label === slot.label && selectedSlot?.inicio === slot.inicio;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setSelectedSlot(slot); setConfirmError(null); }}
                        className={`
                          py-2.5 rounded-button text-sm font-normal transition-colors border
                          ${isSelected
                            ? 'bg-primary text-black border-primary'
                            : slot.is_heat
                              ? 'bg-dark-200 border-primary/40 text-primary hover:bg-primary/10'
                              : 'bg-dark-200 border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
                          }
                        `}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── resumo + confirmar ── */}
          {selectedSlot && (
            <div className="mt-6 bg-dark-200 border border-gray-800 rounded-custom p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Resumo</div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">Serviço</div>
                  <div className="text-white">{entrega?.nome}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">Profissional</div>
                  <div className="text-white">{profissional?.nome}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">Data</div>
                  <div className="text-white">{formatDisplayBR(selectedDay)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">Horário</div>
                  <div className="text-primary font-normal">{selectedSlot.label}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">Duração</div>
                  <div className="text-white">{entrega?.duracao_minutos} min</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">Valor</div>
                  <div className="text-primary">R$ {valorExibido}</div>
                </div>
              </div>

              {confirmError && (
                <div className="text-xs text-red-400 mb-3 bg-red-500/10 border border-red-500/20 rounded p-2">
                  {confirmError}
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full py-3 bg-gradient-to-r from-primary to-yellow-600 text-black rounded-button font-normal uppercase text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {confirming
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> CONFIRMANDO...</>
                  : <><Check className="w-4 h-4" /> CONFIRMAR AGENDAMENTO</>
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
