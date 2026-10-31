// Lector mínimo de .xlsx (sin dependencias): devuelve las filas de la primera hoja.
// Solo se usa en local para generar src/data/*.json; el Excel nunca se sube al repositorio.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");

export function readXlsx(file) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xlsx-'));
  // tar de Windows 10+ (bsdtar) sabe descomprimir zip
  const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
  execFileSync(tar, ['-xf', path.resolve(file), '-C', dir]);
  const ss = fs.readFileSync(path.join(dir, 'xl/sharedStrings.xml'), 'utf8');
  const strings = [...ss.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
    decode([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join('')),
  );
  const sheet = fs.readFileSync(path.join(dir, 'xl/worksheets/sheet1.xml'), 'utf8');
  const rows = [];
  for (const r of sheet.matchAll(/<row [^>]*>([\s\S]*?)<\/row>/g)) {
    const row = {};
    for (const c of r[1].matchAll(/<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const col = c[1].match(/r="([A-Z]+)\d+"/)[1];
      const v = (c[2] || '').match(/<v>([\s\S]*?)<\/v>/);
      let val = v ? v[1] : '';
      if (/t="s"/.test(c[1]) && val !== '') val = strings[+val];
      row[col] = typeof val === 'string' ? val.trim() : val;
    }
    rows.push(row);
  }
  fs.rmSync(dir, { recursive: true, force: true });
  return rows;
}
