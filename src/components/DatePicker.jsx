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
 */

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

/** Formata "YYYY-MM-DD" → "DD.MM.YYYY" para exibição na pílula */
function formatDisplay(iso) {
  if (!iso) return null;
  const p = parseISO(iso);
  if (!p) return null;
  return `${String(p.day).padStart(2, '0')}.${String(p.month).padStart(2, '0')}.${p.year}`;
}

/** Quantos dias tem o mês */
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/** Dia da semana do primeiro dia do mês (0=dom … 6=sáb) */
function firstDayOfMonth(year, month) {
  return new Date(year, month - 1, 1).getDay();
}

const MONTH_NAMES   = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const WEEKDAY_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

// ─── componente ──────────────────────────────────────────────────────────────

export default function DatePicker({ value, onChange, todayISO }) {
  const today    = parseISO(todayISO);
  const selected = parseISO(value);

  const initYear  = selected?.year  ?? today?.year  ?? new Date().getFullYear();
  const initMonth = selected?.month ?? today?.month ?? (new Date().getMonth() + 1);

  const [viewYear,  setViewYear]  = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);
  const [open,      setOpen]      = useState(false);

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
    onChange(toISO(viewYear, viewMonth, day));
    setOpen(false);
  }

  // Grade do calendário
  const totalDays = daysInMonth(viewYear, viewMonth);
  const startDow  = firstDayOfMonth(viewYear, viewMonth);
  const cells     = [...Array(startDow).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];

  const displayValue = formatDisplay(value);

  return (
    <div className="relative inline-block" ref={containerRef}>

      {/* ── pílula disparadora ── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 bg-dark-200 border border-gray-800 rounded-full text-sm font-normal text-white hover:border-primary/50 focus:border-primary/50 focus:outline-none transition-colors"
      >
        {/* bolinha amarela (cor primary do app) */}
        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
        <span className="text-white">
          {displayValue ?? <span className="text-gray-500">Selecionar</span>}
        </span>
      </button>

      {/* ── popover calendário — mesmo design do BookingCalendar ── */}
      {open && (
        <div className="absolute right-0 mt-2 z-50 bg-dark-100 border border-gray-800 rounded-custom shadow-2xl p-5 w-[300px]">

          {/* navegação de mês */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded hover:bg-dark-200 text-gray-400 hover:text-white transition-colors"
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

          {/* labels dias da semana */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAY_SHORT.map((l, i) => (
              <div key={i} className="text-center text-[10px] text-gray-500 uppercase py-1 select-none">
                {l}
              </div>
            ))}
          </div>

          {/* grade de dias */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />;

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
                  className={[
                    'h-9 w-full flex items-center justify-center text-sm font-normal transition-colors select-none rounded-full',
                    isSelected
                      ? 'bg-primary text-black'
                      : isToday && !isSelected
                        ? 'text-primary'
                        : 'text-gray-300 hover:bg-dark-200 hover:text-white cursor-pointer',
                  ].join(' ')}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* rodapé — botão HOJE */}
          {today && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  onChange(todayISO);
                  setViewYear(today.year);
                  setViewMonth(today.month);
                  setOpen(false);
                }}
                className="w-full py-2 rounded-full border border-gray-700 bg-dark-200 text-gray-300 text-sm font-normal uppercase hover:border-gray-500 hover:text-white transition-colors"
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
