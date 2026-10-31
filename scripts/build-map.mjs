// Mapa estático (sin cookies ni scripts de terceros) a partir de teselas de OpenStreetMap.
// Requiere atribución visible: "© OpenStreetMap" (está en la tarjeta del mapa).
import sharp from 'sharp';
import fs from 'node:fs';

const LAT = 35.8883117, LON = -5.3088525; // Calle Solís (Nominatim)
const Z = 17, COLS = 4, ROWS = 3, T = 256;
const n = 2 ** Z;
const fx = ((LON + 180) / 360) * n;
const fy = ((1 - Math.log(Math.tan((LAT * Math.PI) / 180) + 1 / Math.cos((LAT * Math.PI) / 180)) / Math.PI) / 2) * n;
const x0 = Math.floor(fx) - Math.floor(COLS / 2) + 0, y0 = Math.floor(fy) - Math.floor(ROWS / 2);

const tiles = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  const url = `https://tile.openstreetmap.org/${Z}/${x0 + c}/${y0 + r}.png`;
  const res = await fetch(url, { headers: { 'User-Agent': 'casa-y-cocina-static-map/1.0' } });
  if (!res.ok) throw new Error(url + ' ' + res.status);
  tiles.push({ input: Buffer.from(await res.arrayBuffer()), left: c * T, top: r * T });
}
const W = COLS * T, H = ROWS * T;
const pinX = Math.round((fx - x0) * T), pinY = Math.round((fy - y0) * T);

// Mapa en tonos oscuros y cálidos para que encaje con la web
const base = await sharp({ create: { width: W, height: H, channels: 3, background: '#000' } }).composite(tiles).png().toBuffer();
const grey = await sharp(base).greyscale().negate({ alpha: false }).linear(0.55, 8).png().toBuffer();
await sharp(grey).toColourspace('srgb').linear([0.5, 0.4, 0.35], [4, 2, 2])
  .webp({ quality: 78 }).toFile('public/img/mapa.webp');
fs.writeFileSync('src/data/mapa.json', JSON.stringify({ width: W, height: H, pinX, pinY }));
console.log('mapa', W, H, 'pin', pinX, pinY);
