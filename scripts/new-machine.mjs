import { cp, readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const [slug, ...titleParts] = process.argv.slice(2);
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Uso: npm run new:machine -- nombre-maquina "Título opcional"');
  process.exit(1);
}
const destination = resolve(root, 'src/content/writeups', slug);
try {
  await access(destination);
  console.error(`La máquina ${slug} ya existe; no se sobrescribió.`);
  process.exit(1);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await cp(resolve(root, 'templates/maquina'), destination, { recursive: true, force: false, errorOnExist: true });
const file = resolve(destination, 'index.md');
const title = titleParts.join(' ') || slug.replaceAll('-', ' ');
const template = await readFile(file, 'utf8');
await writeFile(file, template.replace(/^title:.*$/m, `title: ${JSON.stringify(title)}`).replace(/^slug:.*$/m, `slug: ${slug}`));
console.log(`Máquina creada: ${file}\nAñade tus imágenes en images/ y completa el artículo antes de hacer push.`);
