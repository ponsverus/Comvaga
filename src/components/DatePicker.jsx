/**
 * DatePicker.jsx
 * Calendário custom para uso no Dashboard (filtros de Histórico e Faturamento).
 *
 * Props:
 *   value     — string ISO "YYYY-MM-DD" (pode ser vazia)
 *   onChange  — (isoString: string) => void
 *   todayISO  — string ISO "YYYY-MM-DD" vindo do serverNow.date (now_sp)
 *               se não for passado, o componente não destaca o "hoje"
 *
 * O componente NÃO usa o horário do device do usuário para nada.
 * Toda referência de "hoje" vem do serverNow do banco (America/Sao_Paulo).
 *
 * Uso no Dashboard — exemplo:
 *
 *   <DatePicker
 *     value={historicoData}
 *     onChange={(iso) => setHistoricoData(iso)}
 *     todayISO={hoje}
 *   />
 */

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

// ─── helpers ─────────────────────────────────────────────────────────────────

/** "YYYY-MM-DD" → { year, month (1-12), day } */
function parseISO(iso) {
  if (!iso) return null;
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m, day: d };
}

/** { year, month (1-12), day } → "YYYY-MM-DD" */
function toISO(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Formata "YYYY-MM-DD" → "DD/MM/YYYY" para exibição */
function formatDisplay(iso) {
  if (!iso) return null;
  const p = parseISO(iso);
  if (!p) return null;
  return `${String(p.day).padStart(2, '0')}/${String(p.month).padStart(2, '0')}/${p.year}`;
}

/** Quantos dias tem o mês */
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/** Dia da semana do primeiro dia do mês (0=dom … 6=sáb) */
function firstDayOfMonth(year, month) {
  return new Date(year, month - 1, 1).getDay();
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// ─── componente ──────────────────────────────────────────────────────────────

export default function DatePicker({ value, onChange, todayISO }) {
  const today = parseISO(todayISO);   // âncora vinda do banco (now_sp)
  const selected = parseISO(value);

  // mês visível no calendário — inicia no mês do valor selecionado,
  // ou no mês de hoje (pelo banco), ou no mês atual do JS como fallback
  const initYear  = selected?.year  ?? today?.year  ?? new Date().getFullYear();
  const initMonth = selected?.month ?? today?.month ?? (new Date().getMonth() + 1);

  const [viewYear,  setViewYear]  = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // Sincroniza a visão quando o value muda externamente
  useEffect(() => {
    if (selected) {
      setViewYear(selected.year);
      setViewMonth(selected.month);
    }
  }, [value]);

  function prevMonth() {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  }

  function selectDay(day) {
    const iso = toISO(viewYear, viewMonth, day);
    onChange(iso);
    setOpen(false);
  }

  // Monta a grade do calendário
  const totalDays  = daysInMonth(viewYear, viewMonth);
  const startDow   = firstDayOfMonth(viewYear, viewMonth); // 0–6
  const cells = [];

  // células vazias antes do dia 1
  for (let i = 0; i < startDow; i++) cells.push(null);
  // dias do mês
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const displayValue = formatDisplay(value);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* botão disparador */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 bg-dark-200 border border-gray-800 rounded-button text-white text-sm cursor-pointer hover:border-primary/50 focus:border-primary/50 focus:outline-none transition-colors min-w-[140px]"
      >
        <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
        <span className="flex-1 text-center">
          {displayValue ?? <span className="text-gray-500">Selecionar</span>}
        </span>
      </button>

      {/* popover do calendário */}
      {open && (
        <div className="absolute right-0 mt-2 z-50 bg-dark-100 border border-gray-700 rounded-custom shadow-2xl p-4 w-[280px]">

          {/* cabeçalho — mês e ano */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded hover:bg-dark-200 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm font-normal text-white uppercase tracking-wide">
              {MONTH_NAMES[viewMonth - 1]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded hover:bg-dark-200 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* labels dos dias da semana */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAY_LABELS.map((label, i) => (
              <div key={i} className="text-center text-[10px] text-gray-500 uppercase py-1">
                {label}
              </div>
            ))}
          </div>

          {/* grade de dias */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} />;
              }

              const isSelected = selected &&
                selected.year  === viewYear &&
                selected.month === viewMonth &&
                selected.day   === day;

              const isToday = today &&
                today.year  === viewYear &&
                today.month === viewMonth &&
                today.day   === day;

              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => selectDay(day)}
                  className={`
                    h-8 w-full rounded text-sm font-normal transition-colors
                    ${isSelected
                      ? 'bg-primary text-black'
                      : isToday
                        ? 'border border-primary/60 text-primary hover:bg-primary/20'
                        : 'text-gray-300 hover:bg-dark-200 hover:text-white'
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* rodapé — botão "Hoje" */}
          {today && (
            <div className="mt-3 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  onChange(todayISO);
                  setViewYear(today.year);
                  setViewMonth(today.month);
                  setOpen(false);
                }}
                className="w-full py-1.5 text-xs text-primary border border-primary/30 rounded-button hover:bg-primary/10 transition-colors uppercase font-normal"
              >
                HOJE
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
