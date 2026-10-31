// Genera las imágenes de la web a partir de las fotos y vídeos originales del cliente
// (carpeta padre). Todas las imágenes son fotos REALES de la tienda: solo se recortan,
// se redimensionan y se comprimen. Uso: node scripts/build-assets.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';

const RAW = path.resolve('..');
const OUT = path.resolve('public/img');
const TMP = path.resolve('tmp/frames');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

// Tamaño "de pantalla" con el que se midieron las coordenadas de cada foto.
const DISPLAY = {
  '1536x2048': [1500, 2000],
  '2048x1536': [2000, 1500],
  '1600x1200': [1600, 1200],
  '1200x1600': [1200, 1600],
  '576x1024': [576, 1024],
};

async function crop(src, box, out, { width = 640, height, fit = 'inside', quality = 74 } = {}) {
  const img = sharp(src);
  const { width: W, height: H } = await img.metadata();
  const [dw, dh] = DISPLAY[`${W}x${H}`] ?? [W, H];
  const sx = W / dw, sy = H / dh;
  const [x0, y0, x1, y1] = box;
  const region = {
    left: Math.max(0, Math.round(x0 * sx)),
    top: Math.max(0, Math.round(y0 * sy)),
    width: Math.min(W, Math.round(x1 * sx)) - Math.max(0, Math.round(x0 * sx)),
    height: Math.min(H, Math.round(y1 * sy)) - Math.max(0, Math.round(y0 * sy)),
  };
  await sharp(src)
    .extract(region)
    .resize({ width, height, fit, withoutEnlargement: fit === 'inside', position: 'attention' })
    .webp({ quality, effort: 5 })
    .toFile(path.join(OUT, out));
}

function frame(video, t, out) {
  execFileSync(ffmpeg, ['-v', 'error', '-y', '-ss', String(t), '-i', path.join(RAW, video), '-frames:v', '1', '-q:v', '2', out]);
  return out;
}

const raw = (f) => path.join(RAW, f);

// ---------- Fotos de ambiente ----------
await crop(raw('exterior2.jpeg'), [0, 0, 1200, 1600], 'fachada.webp', { width: 1000, quality: 72 });
await crop(raw('interior2.jpeg'), [0, 0, 1600, 1200], 'interior-lecreuset.webp', { width: 1400, quality: 72 });
await crop(raw('interior3.jpeg'), [0, 0, 1600, 1200], 'interior-cafeteras.webp', { width: 1400, quality: 72 });
// Los vídeos (inicio y secciones) se generan con Seedance 2.0: ver scripts/seedance.md

// ---------- Fotogramas de vídeo ----------
const fOne = frame('interior9.mp4', 2.6, path.join(TMP, 'one.jpg'));
const fAroma = frame('interior15.mp4', 4.5, path.join(TMP, 'aroma.jpg'));

// ---------- Productos ejemplares (recortes de fotos reales) ----------
const P = { width: 560, quality: 74 };
const products = {
  'p-kr-paella.webp': ['interior12.jpeg', [95, 165, 495, 665]],
  'p-kr-easy26.webp': ['interior12.jpeg', [520, 160, 835, 700]],
  'p-kr-wok.webp': ['interior12.jpeg', [885, 150, 1225, 775]],
  'p-kr-grill.webp': ['interior12.jpeg', [330, 500, 700, 975]],
  'p-kr-marble.webp': ['interior12.jpeg', [190, 985, 450, 1240]],
  'p-kr-duromatic.webp': ['interior12.jpeg', [140, 1265, 1135, 1585]],
  'p-kr-inox.webp': ['interior12.jpeg', [170, 1590, 1170, 2000]],
  'p-jj-cajon.webp': ['interior12.jpeg', [1100, 670, 1500, 960]],
  'p-braun-satin.webp': ['interior12.jpeg', [1120, 320, 1500, 600]],
  'p-lc-wok.webp': ['interior14.jpeg', [85, 290, 690, 1010]],
  'p-lc-sarten.webp': ['interior14.jpeg', [710, 310, 1180, 1160]],
  'p-lc-manoplas.webp': ['interior14.jpeg', [635, 265, 855, 700]],
  'p-lc-salpicaduras.webp': ['interior14.jpeg', [770, 1230, 1225, 1900]],
  'p-braun-s9.webp': ['interior14.jpeg', [1080, 195, 1500, 560]],
  'p-tefal-optigrill.webp': ['interior14.jpeg', [1270, 1480, 1500, 2000]],
  'p-mx-lightmix.webp': ['interior14.jpeg', [110, 210, 315, 505]],
  'p-lc-cocottes.webp': ['interior2.jpeg', [100, 800, 1600, 1200]],
  'p-lc-calabaza.webp': ['interior2.jpeg', [670, 950, 900, 1190]],
  'p-lc-gres.webp': ['interior2.jpeg', [50, 520, 870, 770]],
  'p-lc-cuencos.webp': ['interior2.jpeg', [950, 540, 1600, 740]],
  'p-lc-hervidor.webp': ['interior2.jpeg', [330, 0, 1330, 205]],
  'p-bia-express.webp': ['interior3.jpeg', [0, 460, 420, 980]],
  'p-bia-induction.webp': ['interior3.jpeg', [360, 640, 640, 975]],
  'p-bia-brikka.webp': ['interior3.jpeg', [620, 640, 940, 975]],
  'p-monix.webp': ['interior3.jpeg', [930, 700, 1180, 975]],
  'p-tokyo.webp': ['interior.jpeg', [0, 640, 1060, 1200]],
  'p-rowenta-xforce.webp': ['interior1.jpeg', [270, 330, 740, 535]],
  'p-mx-easyfry.webp': ['interior1.jpeg', [915, 300, 1200, 490]],
  'p-oralb.webp': ['interior1.jpeg', [915, 540, 1200, 660]],
  'p-lk-omelette.webp': ['interior18.jpeg', [235, 110, 690, 400]],
  'p-lk-tortilla.webp': ['interior18.jpeg', [230, 375, 690, 760]],
  'p-lk-ovo.webp': ['interior18.jpeg', [705, 120, 915, 345]],
  'p-lk-veggiedrinks.webp': ['interior18.jpeg', [690, 340, 910, 865]],
  'p-lk-kefir.webp': ['interior18.jpeg', [935, 210, 1360, 590]],
  'p-lk-steam.webp': ['interior18.jpeg', [165, 1020, 555, 1340]],
  'p-lk-glassdish.webp': ['interior18.jpeg', [545, 990, 1255, 1395]],
  'p-lk-duo.webp': ['interior18.jpeg', [250, 1430, 605, 1830]],
  'p-lk-pizza.webp': ['interior18.jpeg', [990, 1470, 1210, 2000]],
  'p-lk-panmolde.webp': ['interior19.jpeg', [100, 50, 1360, 1760]],
  'p-lk-veggieburger.webp': ['interior19.jpeg', [750, 1790, 1130, 2000]],
  'p-bbottles-twin.webp': ['interior22.jpeg', [380, 30, 1020, 1880]],
  'p-lc-botella.webp': ['interior23.jpeg', [530, 230, 800, 1260]],
  'p-lc-travelmug.webp': ['interior23.jpeg', [940, 600, 1220, 1280]],
  'p-brita-cristal.webp': ['interior5.jpeg', [0, 250, 880, 1380]],
  'p-brita-marella.webp': ['interior5.jpeg', [890, 355, 1500, 1380]],
  'p-brabantia-tabla.webp': ['exterior7.jpeg', [780, 370, 1000, 1100]],
  'p-metaltex-storm.webp': ['exterior7.jpeg', [640, 540, 800, 790]],
  'p-infantil.webp': ['exterior7.jpeg', [320, 710, 625, 960]],
  'p-playmarket.webp': ['interior25.jpeg', [920, 1100, 1160, 1660]],
  'p-bra-one.webp': [fOne, [40, 230, 500, 960]],
  'p-tefal-aroma.webp': [fAroma, [80, 0, 576, 700]],
};
for (const [out, [src, box]] of Object.entries(products)) {
  await crop(src.includes(path.sep) ? src : raw(src), box, out, P);
}


// Imagen para compartir (Open Graph) y fotos de los vídeos de prensa (pósters locales)
await sharp(raw('exteriorylogo.jpeg')).resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
  .jpeg({ quality: 80, mozjpeg: true }).toFile(path.resolve('public/og.jpg'));

console.log('Listo.');
