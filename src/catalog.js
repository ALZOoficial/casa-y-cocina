// Catálogo a pantalla completa: al deslizar, cada sección ocupa toda la pantalla con su
// vídeo (foto real de la tienda animada con Seedance) y la anterior sale barrida a la izquierda.
// Al pulsar "Ver productos" se abre el panel con los productos ejemplares.
import data from './data/categorias.json';
import { t, getLang, onLang, price, number } from './i18n.js';
import { WHATSAPP } from './config.js';

const BASE = import.meta.env.BASE_URL;
const cats = data.categorias;
// secciones con vídeo (foto real animada); el resto usa una imagen de ambiente (Seedream) hasta tener fotos reales
const VIDEO = new Set(['sartenes', 'ollas', 'cafe', 'electro', 'utensilios', 'reposteria', 'vajilla', 'cristaleria', 'termos', 'hogar']);

export function initCatalog({ gsap, ScrollTrigger, lenis, openSearch, reduced }) {
  const scroller = document.querySelector('[data-cat-scroller]');
  const media = scroller.querySelector('[data-cat-media]');
  const nameEl = scroller.querySelector('[data-cat-name]');
  const countEl = scroller.querySelector('[data-cat-count]');
  const numEl = scroller.querySelector('[data-cat-num]');
  const indexEl = scroller.querySelector('[data-cat-index]');
  const n = cats.length;
  scroller.style.setProperty('--steps', n);

  // ---------- Capas de imagen/vídeo ----------
  media.innerHTML = cats.map((c, i) => `
    <div class="cat__ph" style="z-index:${n - i}" data-i="${i}">
      <img src="${BASE}img/cat/${c.id}.webp" alt="" ${i > 1 ? 'loading="lazy"' : ''} decoding="async" />
      ${VIDEO.has(c.id) ? `<video muted loop playsinline preload="none" data-src="${BASE}video/cat/${c.id}.mp4" aria-hidden="true"></video>` : ''}
    </div>`).join('');
  const layers = [...media.children];
  const videos = layers.map((l) => l.querySelector('video'));
  videos.forEach((v) => v?.addEventListener('playing', () => v.classList.add('is-ready')));

  indexEl.innerHTML = cats.map((c, i) => `<li><button type="button" data-go="${i}">${c[getLang()]}</button></li>`).join('');
  const indexBtns = [...indexEl.querySelectorAll('button')];

  // ---------- Sección activa ----------
  let active = -1;
  // cada palabra en su máscara para que suba al cambiar de sección
  const lines = (text) => text.split(' ').map((w) => `<span class="ln"><span>${w}</span></span>`).join(' ');
  function setActive(i, force = false) {
    if (i === active && !force) return;
    const prev = active;
    active = i;
    const c = cats[i];
    nameEl.innerHTML = lines(c[getLang()]);
    countEl.textContent = t('cat.count', { n: number(c.articulos) });
    numEl.textContent = String(i + 1).padStart(2, '0');
    indexBtns.forEach((b, j) => b.setAttribute('aria-current', String(j === i)));
    if (!reduced && prev !== -1 && !force) {
      gsap.fromTo(nameEl.querySelectorAll('.ln > span'), { yPercent: 105 }, { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 });
      gsap.fromTo(countEl, { opacity: 0 }, { opacity: 0.85, duration: 0.6 });
    }
    // reproducir solo el vídeo visible (y precargar el siguiente)
    videos.forEach((v, j) => {
      if (!v) return;
      if (Math.abs(j - i) <= 1 && !v.src) { v.src = v.dataset.src; v.preload = 'auto'; }
      if (j === i && stageVisible) v.play().catch(() => {});
      else v.pause();
    });
  }

  let stageVisible = false;
  new IntersectionObserver(([e]) => {
    stageVisible = e.isIntersecting;
    const v = videos[active];
    if (v) stageVisible ? v.play().catch(() => {}) : v.pause();
  }, { threshold: 0.1 }).observe(scroller.querySelector('[data-cat-stage]'));

  // ---------- Scroll ----------
  const pos = (p) => Math.min(n - 1, Math.max(0, Math.floor(p * n + 0.225)));
  if (!reduced) {
    layers.forEach((l, i) => gsap.set(l, { zIndex: n - i }));
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: scroller, start: 'top top', end: 'bottom bottom', scrub: 0.5,
        onUpdate: (st) => setActive(pos(st.progress)),
      },
    });
    layers.slice(0, n - 1).forEach((l, i) => {
      const at = i + 0.55;
      tl.fromTo(l, { xPercent: 0 }, { xPercent: -100, duration: 0.45, ease: 'power2.inOut' }, at);
      const next = layers[i + 1].querySelector('img, video, .cat__type span');
      if (next) tl.fromTo(layers[i + 1].querySelectorAll('img, video, .cat__type span'), { scale: 1.14 }, { scale: 1, duration: 0.6, ease: 'power1.out' }, at);
    });
    tl.set({}, {}, n);
  } else {
    ScrollTrigger.create({
      trigger: scroller, start: 'top top', end: 'bottom bottom',
      onUpdate: (st) => {
        const i = pos(st.progress);
        layers.forEach((l, j) => { l.style.visibility = j === i ? 'visible' : 'hidden'; });
        setActive(i);
      },
    });
  }
  setActive(0, true);

  indexEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (!b) return;
    const i = Number(b.dataset.go);
    const top = scroller.getBoundingClientRect().top + window.scrollY;
    const range = scroller.offsetHeight - window.innerHeight;
    const y = top + ((i + (i ? 0.1 : 0)) / n) * range;
    lenis ? lenis.scrollTo(y, { duration: 1.2 }) : window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  });
  scroller.querySelector('[data-cat-open]').addEventListener('click', (e) => openPanel(active, e.currentTarget));

  // ---------- Panel de productos ----------
  const panel = document.querySelector('[data-panel]');
  const pTitle = panel.querySelector('[data-panel-title]');
  const pBody = panel.querySelector('[data-panel-body]');
  let opener = null, current = -1;

  function renderPanel(i) {
    const c = cats[i], L = getLang();
    pTitle.textContent = c[L];
    const searchBtn = `<button type="button" class="link" data-search-cat="${i}"><span>${t('sheet.buscarCat', { cat: c[L].toLowerCase() })}</span><i class="ph-light ph-arrow-right" aria-hidden="true"></i></button>`;
    if (!c.ejemplares.length) {
      pBody.innerHTML = `<div class="panel__empty"><p>${t('sheet.empty', { n: number(c.articulos) })}</p>${searchBtn}
        <a class="link" href="${WHATSAPP}" target="_blank" rel="noopener"><span>WhatsApp</span><i class="ph-light ph-arrow-up-right" aria-hidden="true"></i></a></div>`;
      return;
    }
    pBody.innerHTML = `<div class="grid">${c.ejemplares.map((p, k) => `
      <article class="product" style="--i:${k}">
        <div class="product__img"><img src="${BASE}img/${p.img}" alt="${(p.marca ? p.marca + ' ' : '') + p[L]}" loading="lazy" decoding="async" /></div>
        ${p.marca ? `<p class="product__brand">${p.marca}</p>` : '<p class="product__brand">&nbsp;</p>'}
        <h4 class="product__name">${p[L]}</h4>
        ${p.desde ? `<p class="product__price">${t('sheet.desde')} ${price(p.desde)}</p>` : ''}
        <a class="product__wa" href="${WHATSAPP}" target="_blank" rel="noopener" aria-label="${t('sheet.wa')}"><i class="ph-light ph-whatsapp-logo" aria-hidden="true"></i></a>
      </article>`).join('')}</div>
      <div class="panel__foot"><span>${t('sheet.more')}</span>${searchBtn}</div>`;
  }

  function openPanel(i, from) {
    opener = from; current = i;
    renderPanel(i);
    pBody.scrollTop = 0;
    panel.hidden = false;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add('is-open')));
    panel.querySelector('[data-panel-close]').focus({ preventScroll: true });
  }
  function closePanel() {
    if (panel.hidden) return;
    panel.classList.remove('is-open');
    lenis?.start();
    document.documentElement.style.overflow = '';
    setTimeout(() => { panel.hidden = true; }, reduced ? 0 : 800);
    opener?.focus({ preventScroll: true });
    current = -1;
  }
  panel.addEventListener('click', (e) => {
    if (e.target.closest('[data-panel-close]')) closePanel();
    const sc = e.target.closest('[data-search-cat]');
    if (sc) { closePanel(); openSearch(Number(sc.dataset.searchCat)); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

  onLang(() => {
    indexBtns.forEach((b, i) => { b.textContent = cats[i][getLang()]; });
    setActive(active, true);
    if (current >= 0) renderPanel(current);
  });
}
