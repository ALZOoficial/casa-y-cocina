import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/playwrite-es';
import './styles.css';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logoSvg from './assets/logo.svg?raw';

import { initLang } from './i18n.js';
import { initIcons } from './icons.js';
import { initCatalog } from './catalog.js';
import { initSearch } from './search.js';
import { initHours } from './hours.js';
import { GOOGLE_REVIEW_URL, LEGAL } from './config.js';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width: 767px)').matches;

document.querySelectorAll('[data-logo]').forEach((el) => { el.innerHTML = logoSvg; el.querySelector('svg').setAttribute('aria-hidden', 'true'); });
initIcons();
initLang();

// ---------- Scroll suave ----------
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  const target = id.length > 1 && document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  closeMenu();
  if (lenis) lenis.scrollTo(target, { duration: 1.4 });
  else target.scrollIntoView();
}));

// ---------- Barra superior ----------
const nav = document.getElementById('nav');
let lastY = 0;
const onScroll = (y) => {
  if (y > lastY + 4 && y > window.innerHeight * 0.6 && !menu.classList.contains('is-open')) nav.classList.add('is-hidden');
  if (y < lastY - 4) nav.classList.remove('is-hidden');
  lastY = y;
};
if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
else ScrollTrigger.create({ onUpdate: (st) => onScroll(st.scroll()) });

const menu = document.getElementById('menu');
const burger = document.querySelector('.nav__burger');
function closeMenu() {
  if (!menu.classList.contains('is-open')) return;
  menu.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  lenis?.start();
  setTimeout(() => { menu.hidden = true; }, 300);
}
burger.addEventListener('click', () => {
  if (menu.classList.contains('is-open')) return closeMenu();
  menu.hidden = false;
  burger.setAttribute('aria-expanded', 'true');
  lenis?.stop();
  requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

// ---------- Inicio ----------
const op = document.querySelector('.op');
const video = op.querySelector('.op__video');
const w1 = op.querySelector('.op__w--1');
const w2 = op.querySelector('.op__w--2');
const amp = op.querySelector('.op__and');
const photo = op.querySelector('.op__photo');

// el título ocupa exactamente el ancho disponible (en móvil va en dos líneas)
const title = op.querySelector('.op__title');
function fitTitle() {
  if (window.innerWidth < 768) { title.style.fontSize = ''; return; }
  title.style.fontSize = '100px';
  const natural = [...title.children].reduce((s, el) => s + el.offsetWidth, 0); // offsetWidth ignora las transformaciones de la animación
  const avail = title.clientWidth;
  title.style.fontSize = `${Math.min(220, (100 * avail) / natural) * 0.995}px`;
}
fitTitle();
document.fonts?.ready.then(fitTitle);
window.addEventListener('resize', fitTitle);

// vídeo de Seedance: versión vertical en móvil
// rutas relativas a la base (la web puede vivir en una subcarpeta, p. ej. GitHub Pages)
const asset = (p) => import.meta.env.BASE_URL + p.replace(/^\//, '');
if (mobile) video.poster = asset(video.dataset.posterMobile);
video.src = asset(mobile ? video.dataset.srcMobile : video.dataset.srcDesktop);
if (reduced) { video.removeAttribute('autoplay'); video.pause(); }

if (!reduced) {
  amp.classList.add('is-off');
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 });
  intro
    .from(w1, { xPercent: -24, opacity: 0, duration: 1.6 }, 0)
    .from(w2, { xPercent: 24, opacity: 0, duration: 1.6 }, 0)
    .from(amp, { scale: 0.7, duration: 1.4 }, 0.35)
    // el "&" se enciende como un neón
    .call(() => amp.classList.remove('is-off'), null, 0.55)
    .call(() => amp.classList.add('is-off'), null, 0.63)
    .call(() => amp.classList.remove('is-off'), null, 0.72)
    .call(() => amp.classList.add('is-off'), null, 0.8)
    .call(() => amp.classList.remove('is-off'), null, 0.98)
    .from('.op__meta > *', { yPercent: 40, opacity: 0, duration: 1.2, stagger: 0.1 }, 0.5)
    .fromTo(photo, { clipPath: 'inset(0% 42% 0% 42%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.inOut', clearProps: 'clipPath' }, 0.45)
    .fromTo(video, { scale: 1.18 }, { scale: 1, duration: 1.9, ease: 'power2.out' }, 0.45);

  // al bajar, la cámara del vídeo avanza hacia la olla: el scroll controla el tiempo del vídeo
  // (codificado con todos los fotogramas clave para que avance fino) y al final hace zoom sobre la olla
  let fromT = 0, scrubbing = false, rafSeek = 0, wantT = 0;
  const seek = () => { rafSeek = 0; if (Math.abs(video.currentTime - wantT) > 0.02) video.currentTime = wantT; };
  gsap.timeline({
    scrollTrigger: {
      trigger: '.opwrap', start: 'top top', end: () => '+=' + window.innerHeight * 1.2, scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: (st) => {
        const p = st.progress;
        if (p > 0.002 && !scrubbing) { scrubbing = true; fromT = video.currentTime; video.pause(); }
        if (p <= 0.002 && scrubbing) { scrubbing = false; video.currentTime = fromT; video.play().catch(() => {}); return; }
        if (!scrubbing || !video.duration) return;
        wantT = fromT + Math.min(1, p / 0.8) * (video.duration - 0.05 - fromT);
        if (!rafSeek) rafSeek = requestAnimationFrame(seek);
      },
    },
  })
    // valores de partida explícitos: sin ellos GSAP interpola desde "filter: none" y el vídeo salta a negro
    .fromTo(video, { scale: 1, filter: 'brightness(1) saturate(1)' }, { scale: 1.12, filter: 'brightness(0.95) saturate(1.05)', ease: 'none', duration: 0.75, immediateRender: false }, 0)
    .to(video, { scale: 2.1, filter: 'brightness(0.7) saturate(1.1)', ease: 'power2.in', duration: 0.25 }, 0.75)
    .fromTo(w1, { xPercent: 0 }, { xPercent: () => (mobile ? -40 : -70), ease: 'power1.in', duration: 1, immediateRender: false }, 0)
    .fromTo(w2, { xPercent: 0 }, { xPercent: () => (mobile ? 40 : 55), ease: 'power1.in', duration: 1, immediateRender: false }, 0)
    .fromTo(amp, { scale: 1 }, { scale: 1.5, ease: 'none', duration: 1, immediateRender: false }, 0);
  gsap.fromTo('.dome__inner', { y: () => window.innerHeight * 0.12, opacity: 0 }, {
    y: 0, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: '.dome', start: 'top bottom', end: 'top 35%', scrub: 0.5 },
  });

  // cinta de texto que se desliza
  gsap.fromTo('.ribbon__track', { xPercent: 10 }, { xPercent: -40, ease: 'none', scrollTrigger: { trigger: '.ribbon', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
}

// ---------- Secciones ----------
const search = initSearch({ lenis, reduced });
initCatalog({ gsap, ScrollTrigger, lenis, openSearch: search.open, reduced });
initHours();

// apariciones al entrar en pantalla
document.querySelectorAll('.eyebrow, .h-xl, .cat__lead, .lead, .phone, .medios__title, .resenas__hand').forEach((el) => el.classList.add('lift'));
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}), { threshold: 0, rootMargin: '0px 0px -12% 0px' }); // umbral 0: con clip-path el ratio visible es 0
document.querySelectorAll('.lift, [data-window], .contacto').forEach((el) => io.observe(el));

// vídeos de prensa: solo se cargan al pulsar
document.querySelectorAll('[data-video]').forEach((v) => {
  v.querySelector('.video__play').addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = v.dataset.src;
    f.title = v.querySelector('.video__title').textContent;
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    v.appendChild(f);
    v.classList.add('is-playing');
  });
});

// reseñas y legales (se activan al rellenar src/config.js)
if (GOOGLE_REVIEW_URL) {
  const a = document.querySelector('[data-review-link]');
  a.href = GOOGLE_REVIEW_URL;
  a.hidden = false;
  document.querySelector('[data-review-soon]').hidden = true;
}
document.querySelectorAll('[data-legal]').forEach((a) => { if (LEGAL[a.dataset.legal]) a.href = LEGAL[a.dataset.legal]; else a.hidden = true; });
document.querySelector('[data-year]').textContent = new Date().getFullYear();

// recalcular posiciones cuando terminan de cargar las fuentes
document.fonts?.ready.then(() => ScrollTrigger.refresh());
