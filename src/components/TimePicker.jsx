import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * TimePicker
 *
 * Props:
 *   value    — "HH:MM" string (formato 24h)
 *   onChange — (value: "HH:MM") => void
 */
export default function TimePicker({ value, onChange }) {
  const [open, setOpen]     = useState(false);
  const [mode, setMode]     = useState('h');
  const [hour, setHour]     = useState(8);
  const [minute, setMinute] = useState(0);
  const [pos, setPos]       = useState({ top: 0, left: 0 });

  const triggerRef = useRef(null);
  const canvasRef  = useRef(null);
  const dragging   = useRef(false);
  const modeRef    = useRef('h');
  const hourRef    = useRef(8);
  const minuteRef  = useRef(0);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { hourRef.current = hour; }, [hour]);
  useEffect(() => { minuteRef.current = minute; }, [minute]);

  const pad = (n) => String(n).padStart(2, '0');
  const display = value ? String(value).slice(0, 5) : '—';

  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        !document.getElementById('timepicker-portal')?.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    draw();
  }, [open, mode, hour, minute]);

  function openPicker() {
    if (value) {
      const [h, m] = String(value).split(':').map(Number);
      if (Number.isFinite(h)) { setHour(h); hourRef.current = h; }
      if (Number.isFinite(m)) { setMinute(m); minuteRef.current = m; }
    }
    setMode('h');
    modeRef.current = 'h';
    dragging.current = false;

    // posição: centralizado horizontalmente na viewport, abaixo do trigger
    const rect = triggerRef.current.getBoundingClientRect();
    const pickerW = 264;
    const left = Math.max(8, Math.min(
      window.innerWidth - pickerW - 8,
      rect.left + rect.width / 2 - pickerW / 2
    ));
    setPos({ top: rect.bottom + window.scrollY + 8, left });
    setOpen(true);
  }

  // ── desenho com devicePixelRatio (canvas nítido em telas de alta densidade) ──
  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr  = window.devicePixelRatio || 1;
    const SIZE = 240;

    if (canvas.width !== SIZE * dpr || canvas.height !== SIZE * dpr) {
      canvas.width        = SIZE * dpr;
      canvas.height       = SIZE * dpr;
      canvas.style.width  = SIZE + 'px';
      canvas.style.height = SIZE + 'px';
    }

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = SIZE / 2, cy = SIZE / 2;
    ctx.clearRect(0, 0, SIZE, SIZE);

    ctx.beginPath();
    ctx.arc(cx, cy, 116, 0, Math.PI * 2);
    ctx.fillStyle = '#242426';
    ctx.fill();

    if (mode === 'h') {
      [92, 60].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    mode === 'h' ? drawHours(ctx, cx, cy) : drawMinutes(ctx, cx, cy);
    drawHand(ctx, cx, cy);
  }

  function ang(i, total) { return (i / total) * Math.PI * 2 - Math.PI / 2; }

  function drawHours(ctx, cx, cy) {
    const am = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    am.forEach((n, i) => {
      const a = ang(i, 12), R = 92;
      const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      const active = hour === n;
      if (active) { ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fillStyle = '#d4a017'; ctx.fill(); }
      ctx.fillStyle = active ? '#000' : '#e0e0e0';
      ctx.font = `${active ? 600 : 400} 14px system-ui`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(n), x, y);
    });

    const pm = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];
    pm.forEach((n, i) => {
      const a = ang(i, 12), R = 60;
      const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      const label = n === 0 ? '00' : String(n);
      const active = hour === n;
      if (active) { ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.fillStyle = '#d4a017'; ctx.fill(); }
      ctx.fillStyle = active ? '#000' : '#777';
      ctx.font = `${active ? 600 : 400} 11px system-ui`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    });
  }

  function drawMinutes(ctx, cx, cy) {
    const R = 92;
    for (let i = 0; i < 60; i++) {
      const a = ang(i, 60);
      if (i % 5 !== 0) {
        ctx.beginPath();
        ctx.moveTo(cx + (R + 6) * Math.cos(a), cy + (R + 6) * Math.sin(a));
        ctx.lineTo(cx + (R + 11) * Math.cos(a), cy + (R + 11) * Math.sin(a));
        ctx.strokeStyle = '#3a3a3c'; ctx.lineWidth = 1.5; ctx.stroke();
        continue;
      }
      const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      const active = minute === i;
      if (active) { ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fillStyle = '#d4a017'; ctx.fill(); }
      ctx.fillStyle = active ? '#000' : '#e0e0e0';
      ctx.font = `${active ? 600 : 400} 13px system-ui`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(pad(i), x, y);
    }
  }

  function drawHand(ctx, cx, cy) {
    const am = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const pm = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];
    let a, R;

    if (mode === 'h') {
      const isPM = hour >= 13 || hour === 0;
      R = isPM ? 60 : 92;
      const idx = isPM ? pm.indexOf(hour) : am.indexOf(hour);
      a = ang(idx < 0 ? 0 : idx, 12);
    } else {
      R = 92; a = ang(minute, 60);
    }

    const ex = cx + R * Math.cos(a), ey = cy + R * Math.sin(a);

    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey);
    ctx.strokeStyle = 'rgba(212,160,23,0.75)';
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke();

    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#d4a017'; ctx.fill();

    const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, 20);
    g.addColorStop(0, 'rgba(212,160,23,0.22)');
    g.addColorStop(1, 'rgba(212,160,23,0)');
    ctx.beginPath(); ctx.arc(ex, ey, 20, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
  }

  // ── interação ──────────────────────────────────────────────────────────────
  function getPoint(e) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (240 / rect.width) - 120,
      y: (clientY - rect.top)  * (240 / rect.height) - 120,
    };
  }

  function resolveSelection(e) {
    const pt = getPoint(e);
    if (!pt) return;
    const { x, y } = pt;
    const dist = Math.hypot(x, y);
    const a    = Math.atan2(y, x) + Math.PI / 2;
    const norm = (a < 0 ? a + Math.PI * 2 : a) / (Math.PI * 2);
    const idx  = Math.round(norm * 12) % 12;

    if (modeRef.current === 'h') {
      const am = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const pm = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];
      const h  = dist < 76 ? pm[idx] : am[idx];
      setHour(h); hourRef.current = h;
    } else {
      const m = Math.round(norm * 60 / 5) * 5 % 60;
      setMinute(m); minuteRef.current = m;
    }
  }

  function handlePointerDown(e) {
    e.preventDefault();
    dragging.current = true;
    resolveSelection(e);
    if (modeRef.current === 'h') {
      setTimeout(() => {
        setMode('m'); modeRef.current = 'm';
        dragging.current = false;
      }, 350);
    }
  }

  function handlePointerMove(e) {
    e.preventDefault();
    if (!dragging.current) return;
    resolveSelection(e);
  }

  function handlePointerUp(e) {
    e.preventDefault();
    if (!dragging.current) return;
    dragging.current = false;
    if (modeRef.current === 'm') {
      resolveSelection(e);
      onChange(`${pad(hourRef.current)}:${pad(minuteRef.current)}`);
      setOpen(false);
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPicker}
        className="w-full flex items-center justify-between px-4 py-3 bg-dark-200 border border-gray-800 rounded-custom text-white hover:border-gray-700 focus:border-primary/50 focus:outline-none transition-colors"
      >
        <span className="text-sm font-normal tabular-nums">{display}</span>
        <span className="pointer-events-none flex items-center justify-center w-5 h-5 rounded-full bg-dark-100 border border-gray-800 text-gray-400 text-xs shrink-0">
          ▾
        </span>
      </button>

      {open && createPortal(
        <div
          id="timepicker-portal"
          style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 9999 }}
        >
          <div style={{
            background: '#1c1c1e',
            border: '1px solid #2a2a2a',
            borderRadius: 3,
            padding: 12,
            boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
            width: 264,
          }}>
            <canvas
              ref={canvasRef}
              style={{ display: 'block', cursor: 'pointer', touchAction: 'none', borderRadius: '50%' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
