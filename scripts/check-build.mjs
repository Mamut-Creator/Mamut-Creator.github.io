import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const base = `${(process.env.BASE_PATH || '/').replace(/\/$/, '')}/`;
let checked = 0;
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) { await walk(file); continue; }
    if (!['.html', '.css'].includes(extname(file))) continue;
    const source = await readFile(file, 'utf8');
    const references = extname(file) === '.css'
      ? [...source.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(match => match[1])
      : [...source.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map(match => match[1]);
    for (const reference of references) {
      if (!reference.startsWith('/') || reference.startsWith('//')) continue;
      const pathname = reference.split(/[?#]/)[0];
      if (!pathname.startsWith(base)) throw new Error(`Ruta sin base ${base}: ${reference} en ${relative(root, file)}`);
      const target = resolve(root, decodeURIComponent(pathname.slice(base.length)));
      const info = await stat(target).catch(() => null);
      if (!info) throw new Error(`Referencia local rota: ${reference} en ${relative(root, file)}`);
      if (info.isDirectory()) await stat(resolve(target, 'index.html'));
      checked++;
    }
  }
}
await walk(root);
console.log(`${checked} enlaces y recursos locales comprobados con base ${base}`);
