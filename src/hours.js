// Horario: barras sobre un eje de horas, estado en vivo (hora de Ceuta = Europe/Madrid)
// y una línea LED que marca la hora actual.
import { t, onLang } from './i18n.js';

// horas en decimal; lunes = 0
export const HOURS = [
  [[9.5, 13.5], [17.5, 20.5]],
  [[9.5, 13.5], [17.5, 20.5]],
  [[9.5, 13.5], [17.5, 20.5]],
  [[9.5, 13.5], [17.5, 20.5]],
  [[9.5, 13.5], [17.5, 20.5]],
  [[10.5, 14]],
  [],
];
const FROM = 9, TO = 21;
const fmt = (h) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
const pct = (h) => ((h - FROM) / (TO - FROM)) * 100;

function nowInCeuta() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(parts.weekday);
  return { day, h: Number(parts.hour) + Number(parts.minute) / 60 };
}

export function status(now = nowInCeuta()) {
  const today = HOURS[now.day];
  const seg = today.find(([a, b]) => now.h >= a && now.h < b);
  if (seg) return { open: true, text: t('status.open', { t: fmt(seg[1]) }) };
  const later = today.find(([a]) => a > now.h);
  if (later) return { open: false, text: t('status.opensToday', { t: fmt(later[0]) }) };
  for (let k = 1; k <= 7; k++) {
    const d = (now.day + k) % 7;
    if (HOURS[d].length) {
      const time = fmt(HOURS[d][0][0]);
      return { open: false, text: k === 1 ? t('status.opensTomorrow', { t: time }) : t('status.opensDay', { d: t('days')[d].toLowerCase(), t: time }) };
    }
  }
  return { open: false, text: '' };
}

export function initHours() {
  const el = document.querySelector('[data-timeline]');
  const st = document.querySelector('[data-status]');
  const stText = st.querySelector('[data-status-text]');

  function render() {
    const now = nowInCeuta();
    const days = t('days');
    const ticks = [];
    for (let h = FROM; h <= TO; h++) ticks.push(`<span class="tl__tick${(h - FROM) % 3 ? ' tl__tick--minor' : ''}" style="left:${pct(h)}%">${h}</span>`);
    el.innerHTML = `
      <div class="tl__axis" aria-hidden="true"><span></span><div class="tl__ticks">${ticks.join('')}</div><span></span></div>
      ${HOURS.map((segs, d) => {
        const en = document.documentElement.lang === 'en';
        const text = segs.length
          ? segs.map(([a, b]) => (en ? `${fmt(a)}-${fmt(b)}` : `${fmt(a)} a ${fmt(b)}`)).join(en ? ', ' : ' y ')
          : t('horario.closed');
        return `
        <div class="tl__row${d === now.day ? ' is-today' : ''}">
          <span class="tl__day" data-today="${t('horario.today')}">${days[d]}</span>
          <div class="tl__track">
            ${segs.length ? segs.map(([a, b]) => `<span class="tl__bar" tabindex="0" style="left:${pct(a)}%;width:${pct(b) - pct(a)}%" aria-label="${days[d]}: ${fmt(a)} - ${fmt(b)}"><span class="tl__tip">${fmt(a)} - ${fmt(b)}</span></span>`).join('') : '<span class="tl__closed"></span>'}
          </div>
          <span class="tl__info">${text}</span>
          <span class="tl__mobile" hidden>${text}</span>
        </div>`;
      }).join('')}
      ${now.h >= FROM && now.h <= TO ? `<span class="tl__now" data-label="${t('horario.now')}" style="left:calc(var(--label) + (100% - var(--label) - var(--info)) * ${pct(now.h) / 100})"></span>` : ''}
    `;
    const s = status(now);
    stText.textContent = s.text;
    st.classList.toggle('is-open', s.open);
    st.classList.toggle('is-closed', !s.open);
    if (el.dataset.seen) el.classList.add('is-in');
    // estado también en el inicio
    const op = document.querySelector('[data-op-status]');
    if (op) { op.querySelector('[data-op-status-text]').textContent = s.text; op.classList.toggle('is-open', s.open); op.classList.toggle('is-closed', !s.open); }
  }
  render();
  setInterval(render, 60_000);
  onLang(render);
  new IntersectionObserver(([e], o) => {
    if (e.isIntersecting) { el.dataset.seen = '1'; requestAnimationFrame(() => el.classList.add('is-in')); o.disconnect(); }
  }, { threshold: 0.3 }).observe(el);
}
