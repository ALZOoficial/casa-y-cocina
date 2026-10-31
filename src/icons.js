// Iconos Phosphor (trazo light) como SVG en línea: solo se incluyen los que usa la web.
// En el HTML se escriben como <i class="ph-light ph-nombre"></i> y aquí se rellenan.
const light = import.meta.glob(
  '/node_modules/@phosphor-icons/core/assets/light/{phone,arrow-down,arrow-up-right,magnifying-glass,caret-left,caret-right,whatsapp-logo,facebook-logo,calendar-dots,plus,x,star,google-logo}-light.svg',
  { query: '?raw', import: 'default', eager: true },
);
const fill = import.meta.glob('/node_modules/@phosphor-icons/core/assets/fill/play-fill.svg', { query: '?raw', import: 'default', eager: true });

const SVG = {};
for (const [p, s] of Object.entries({ ...light, ...fill })) {
  const name = p.split('/').pop().replace('.svg', ''); // p.ej. "phone-light"
  SVG[name] = s.replace('<svg ', '<svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" ');
}

function fillIcon(el) {
  if (el.dataset.ph) return;
  const weight = el.classList.contains('ph-fill') ? 'fill' : 'light';
  const name = [...el.classList].find((c) => c.startsWith('ph-') && c !== 'ph-light' && c !== 'ph-fill');
  const svg = name && SVG[`${name.slice(3)}-${weight}`];
  if (svg) { el.innerHTML = svg; el.dataset.ph = '1'; }
}

export function initIcons(root = document) {
  root.querySelectorAll('i.ph-light, i.ph-fill').forEach(fillIcon);
  new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => {
    if (n.nodeType !== 1) return;
    if (n.matches?.('i.ph-light, i.ph-fill')) fillIcon(n);
    n.querySelectorAll?.('i.ph-light, i.ph-fill').forEach(fillIcon);
  }))).observe(document.body, { childList: true, subtree: true });
}
