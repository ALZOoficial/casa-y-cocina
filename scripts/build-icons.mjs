// Favicon y apple-touch-icon: el "&" del rótulo real sobre granate.
import sharp from 'sharp';
import fs from 'node:fs';
const svg = fs.readFileSync('src/assets/logo.svg', 'utf8').replace('currentColor', '#fbf7f1');
const big = await sharp(Buffer.from(svg), { density: 300 }).resize({ width: 3050 }).png().toBuffer();
const meta = await sharp(big).metadata();
// zona del "&" (proporción medida sobre el logo)
const ampRaw = await sharp(big).extract({ left: Math.round(meta.width * 0.352), top: 0, width: Math.round(meta.width * 0.092), height: meta.height }).png().toBuffer();
const amp = await sharp(ampRaw).trim().png().toBuffer();
async function icon(size, out, radius) {
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#8a2b1f"/></svg>`);
  const glyph = await sharp(amp).resize({ height: Math.round(size * 0.62), width: Math.round(size * 0.62), fit: 'inside' }).toBuffer();
  await sharp(bg).composite([{ input: glyph, gravity: 'center' }]).png().toFile(out);
}
await icon(64, 'public/favicon.png', 14);
await icon(180, 'public/apple-touch-icon.png', 38);
await icon(512, 'tmp/icon-512.png', 110);
console.log('iconos ok');
