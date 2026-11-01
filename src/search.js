// Buscador sobre el listado completo (se descarga solo cuando se abre).
import data from './data/categorias.json';
import { t, getLang, onLang, price, number } from './i18n.js';
import { waLink } from './config.js';

const cats = data.categorias;
const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ñ/g, 'n');
const esc = (s) => s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);

export function initSearch({ lenis, reduced }) {
  const root = document.querySelector('[data-search]');
  const input = root.querySelector('[data-search-input]');
  const results = root.querySelector('[data-search-results]');
  const filters = root.querySelector('[data-search-filters]');
  let index = null, loading = null, cat = -1, limit = 40, opener = null;

  function renderFilters() {
    const L = getLang();
    filters.innerHTML = [`<button type="button" class="chip" data-cat="-1" aria-pressed="${cat === -1}">${t('search.all')}</button>`]
      .concat(cats.map((c, i) => `<button type="button" class="chip" data-cat="${i}" aria-pressed="${cat === i}">${c[L]}</button>`)).join('');
  }
  filters.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = Number(b.dataset.cat); limit = 40;
    filters.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
    render();
  });

  function load() {
    loading ??= fetch(`${import.meta.env.BASE_URL}data/buscador.json`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((rows) => { index = rows.map(([n, c, s, p, m]) => ({ n, c, s, p, m, f: fold(`${n} ${s}`) })); })
      .catch((err) => { loading = null; throw err; });
    return loading;
  }

  // `fold` conserva la longitud del texto, así que las posiciones valen para el nombre original
  function highlight(name, tokens) {
    const f = fold(name);
    const marks = new Array(name.length).fill(false);
    tokens.forEach((tk) => {
      if (tk.length < 2) return;
      for (let i = f.indexOf(tk); i >= 0; i = f.indexOf(tk, i + tk.length)) marks.fill(true, i, i + tk.length);
    });
    let out = '', open = false;
    for (let i = 0; i < name.length; i++) {
      if (marks[i] !== open) { out += marks[i] ? '<mark>' : '</mark>'; open = marks[i]; }
      out += esc(name[i]);
    }
    return open ? out + '</mark>' : out;
  }

  function render() {
    const q = input.value.trim();
    if (!index) {
      results.innerHTML = '<div class="skeleton"></div>'.repeat(5);
      load().then(render).catch(() => { results.innerHTML = `<p class="search__msg">${t('search.error')}</p>`; });
      return;
    }
    const tokens = fold(q).split(/\s+/).filter(Boolean);
    if (!tokens.length && cat < 0) { results.innerHTML = `<p class="search__msg">${t('search.hint')}</p>`; return; }
    const hits = index.filter((it) => (cat < 0 || it.c === cat) && tokens.every((tk) => it.f.includes(tk)));
    if (!hits.length) { results.innerHTML = `<div class="search__msg"><p>${t('search.none', { q: esc(q) })}</p><a class="btn" href="${waLink(t('wa.buscar', { q }))}" target="_blank" rel="noopener"><i class="ph-light ph-whatsapp-logo" aria-hidden="true"></i><span>${t('sheet.wa')}</span></a></div>`; return; }
    // primero los que empiezan por la búsqueda
    if (tokens[0]) hits.sort((a, b) => (b.f.startsWith(tokens[0]) - a.f.startsWith(tokens[0])));
    const L = getLang();
    results.innerHTML = `<p class="search__count">${t('search.count', { n: number(hits.length) })}</p>` +
      hits.slice(0, limit).map((it) => `
        <div class="result">
          <p class="result__name">${highlight(it.n, tokens)}</p>
          <p class="result__meta">${[cats[it.c]?.[L], it.s].filter(Boolean).map(esc).join(' · ')}</p>
          <p class="result__price">${it.m ? t('sheet.desde') + ' ' : ''}${price(it.p)}</p>
          <a class="result__wa" href="${waLink(t('wa.producto', { p: it.n }))}" target="_blank" rel="noopener" aria-label="${t('sheet.wa')}: ${esc(it.n)}"><i class="ph-light ph-whatsapp-logo" aria-hidden="true"></i></a>
        </div>`).join('') +
      (hits.length > limit ? `<div style="padding:12px 14px"><button type="button" class="btn btn--glass btn--sm" data-more>${t('search.more')}</button></div>` : '');
  }
  results.addEventListener('click', (e) => { if (e.target.closest('[data-more]')) { limit += 60; render(); } });

  let deb = 0;
  input.addEventListener('input', () => { clearTimeout(deb); limit = 40; deb = setTimeout(render, 90); });

  function open(category = -1) {
    opener = document.activeElement;
    cat = category; limit = 40;
    renderFilters();
    root.hidden = false;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-open')));
    input.focus({ preventScroll: true });
    if (cat >= 0) filters.querySelector(`[data-cat="${cat}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest' });
    render();
  }
  function close() {
    if (root.hidden) return;
    root.classList.remove('is-open');
    lenis?.start();
    document.documentElement.style.overflow = '';
    setTimeout(() => { root.hidden = true; }, reduced ? 0 : 700);
    opener?.focus?.({ preventScroll: true });
  }
  root.addEventListener('click', (e) => { if (e.target.closest('[data-search-close]')) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  document.querySelectorAll('[data-open-search]').forEach((b) => b.addEventListener('click', () => open()));
  onLang(() => { if (!root.hidden) { renderFilters(); render(); } });

  return { open };
}
