// Convierte el listado de artículos (Excel del cliente) en los datos de la web.
// - src/data/categorias.json : categorías, nº de artículos y productos ejemplares con su "desde".
// - public/data/buscador.json: índice del buscador (artículos agrupados por modelo, con medidas).
// Las columnas de coste del Excel (Ult Prec Compr, PMP) NO se leen ni se publican.
// Uso: node scripts/build-catalog.mjs [ruta-al-excel]
import fs from 'node:fs';
import path from 'node:path';
import { readXlsx } from './xlsx-read.mjs';
import { CATEGORIAS, EJEMPLARES } from './catalog-config.mjs';

const excel = process.argv[2] ?? path.resolve('..', 'CASA&COCINA LISTADO ARTÍCULOS.xlsx');
const rows = readXlsx(excel);
const head = rows[0];
const col = (name) => Object.keys(head).find((k) => head[k] === name);
const C_DESC = col('Descripción'), C_FAM = col('Familias'), C_PVP = col('Pvp Tarifa General');

const items = rows.slice(1)
  .map((r) => ({ desc: String(r[C_DESC] ?? '').replace(/\s+/g, ' ').trim(), fam: String(r[C_FAM] ?? '').trim(), pvp: Number(r[C_PVP]) || 0 }))
  .filter((it) => it.desc && it.pvp > 0);

const famToCat = new Map();
CATEGORIAS.forEach((c, i) => c.familias.forEach((f) => famToCat.set(f, i)));
const OTROS = CATEGORIAS.length; // familias vacías o "SIN FAMILIA": solo en el buscador

// ---------- Nombres legibles ----------
const ABBR = [
  [/^JGO\.?\b/, 'JUEGO'], [/\bJGO\.?\b/g, 'JUEGO'],
  [/^CAF\.\s*AUT\.?/, 'CAFETERA AUTOMÁTICA'], [/^CAF\./, 'CAFETERA'], [/\bAUT\./g, 'AUTOMÁTICA'],
  [/\bIND\.?(?=\s|$)/g, 'INDUCCIÓN'], [/\bINDUC\b/g, 'INDUCCIÓN'],
  [/\bANTIADH\.?/g, 'ANTIADHERENTE'], [/\bINOX\.?\b/g, 'INOX'],
  [/\bPZAS?\.?(?=\s|$)/g, 'PIEZAS'], [/\bPZS?\.?(?=\s|$)/g, 'PIEZAS'],
  [/\bS\/A\b/g, 'SIN ASA'], [/\bC\/(?=\w)/g, 'CON '],
];
const SIZE_RE = /\b\d+(?:[.,]\d+)?(?:\s?(?:X|-|Y)\s?\d+(?:[.,]\d+)?)*\s?(?:CM|MM|L|LT|LTS|ML|CL|TZS?|TAZAS|W|KG|GR|G|M)\b\.?/g;

function pretty(s) {
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
function normSize(s) {
  return s.replace(/\s+/g, '').replace(/TZS?$|TAZAS$/, ' tazas').replace(/LTS?$/, ' L').replace(/(\d)(CM|MM|ML|CL|KG|GR|G|W|M)$/, '$1 $2').replace(/(\d)L$/, '$1 L')
    .replace(/X/g, ' × ').replace(/Y/g, ' y ').replace(/-/g, '-').replace(/CM$/, 'cm').replace(/MM$/, 'mm').replace(/ML$/, 'ml').replace(/CL$/, 'cl').replace(/KG$/, 'kg').replace(/GR$|G$/, 'g').replace(/ M$/, ' m');
}

const groups = new Map();
for (const it of items) {
  let d = it.desc.toUpperCase();
  for (const [re, rep] of ABBR) d = d.replace(re, rep);
  if (it.fam === 'CUCHILLOS') d = d.replace(/^C\.\s*/, 'CUCHILLO ');
  const sizes = (d.match(SIZE_RE) || []).map(normSize);
  const base = d.replace(SIZE_RE, ' ').replace(/\s+/g, ' ').replace(/[\s,.-]+$/, '').trim() || d;
  const cat = famToCat.has(it.fam) ? famToCat.get(it.fam) : OTROS;
  const key = cat + '|' + base;
  const g = groups.get(key) ?? { n: pretty(base), c: cat, s: new Set(), p: Infinity, k: 0 };
  sizes.forEach((s) => g.s.add(s));
  g.p = Math.min(g.p, it.pvp);
  g.k++;
  groups.set(key, g);
}

const sizeSort = (a, b) => parseFloat(a.replace(',', '.')) - parseFloat(b.replace(',', '.')) || a.localeCompare(b);
const index = [...groups.values()]
  .map((g) => [g.n, g.c, [...g.s].sort(sizeSort).join(' · '), Math.round(g.p * 100) / 100, g.k > 1 ? 1 : 0])
  .sort((a, b) => a[0].localeCompare(b[0], 'es'));

// ---------- Categorías + ejemplares ----------
const counts = new Array(CATEGORIAS.length).fill(0);
items.forEach((it) => { if (famToCat.has(it.fam)) counts[famToCat.get(it.fam)]++; });

function desde(p) {
  if (!p) return null;
  const rs = items.filter((it) => p.re.test(it.desc.toUpperCase()) && (!p.fam || p.fam.includes(it.fam)));
  if (!rs.length) { console.warn('  sin coincidencias para', p.re); return null; }
  return Math.min(...rs.map((r) => r.pvp));
}

const categorias = CATEGORIAS.map((c, i) => ({
  id: c.id, es: c.es, en: c.en, img: c.img, articulos: counts[i],
  ejemplares: (EJEMPLARES[c.id] ?? []).map((e) => ({ marca: e.marca, es: e.es, en: e.en, img: e.img, desde: desde(e.precio) })),
}));

fs.mkdirSync('src/data', { recursive: true });
fs.mkdirSync('public/data', { recursive: true });
fs.writeFileSync('src/data/categorias.json', JSON.stringify({ total: items.length, categorias }, null, 1));
fs.writeFileSync('public/data/buscador.json', JSON.stringify(index));

console.log(`Artículos con precio: ${items.length}. Entradas del buscador: ${index.length}.`);
categorias.forEach((c) => console.log(`  ${c.es.padEnd(28)} ${String(c.articulos).padStart(5)}  ejemplares: ${c.ejemplares.length} ${c.ejemplares.filter((e) => e.desde).map((e) => e.es + '=' + e.desde).join(', ')}`));
