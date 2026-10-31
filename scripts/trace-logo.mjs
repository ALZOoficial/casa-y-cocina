// Traza el rótulo real de la fachada (logo.jpeg) a SVG vectorial.
import sharp from 'sharp';
import potrace from 'potrace';
import fs from 'node:fs';

const angle = Number(process.argv[2] ?? 0.8);
const thr = Number(process.argv[3] ?? 190);
const src = '../logo.jpeg';
const rotated = await sharp(src).rotate(angle, { background: '#000' }).toBuffer();
const meta = await sharp(rotated).metadata();
// rotating enlarges canvas: offset
const dx = (meta.width - 2048) / 2, dy = (meta.height - 1536) / 2;
const crop = { left: Math.round(60 + dx), top: Math.round(610 + dy), width: 1960, height: 280 };
const bw = await sharp(rotated).extract(crop).greyscale().normalise().threshold(thr).png().toBuffer();
fs.writeFileSync('tmp/logo-bw.png', bw);
potrace.trace(bw, { threshold: 128, turdSize: 40, optTolerance: 0.4, color: '#000' }, (err, svg) => {
  if (err) throw err;
  fs.writeFileSync('tmp/logo-trace.svg', svg);
  console.log('ok', svg.length);
});
