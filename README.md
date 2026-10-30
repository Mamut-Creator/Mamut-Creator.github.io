# Bitácora · Astro + Aceternity UI

Desarrollo: `npm install` y `npm run dev`. Producción: `npm run build`. Vista previa: `npm run preview`.

Para añadir una máquina, copia un archivo de `src/content/writeups/` y cambia el frontmatter. Usa un slug único en minúsculas. Las dificultades son `Fácil`, `Media` y `Difícil`. Escribe el artículo en Markdown; los títulos de nivel 2 forman el índice. Cada archivo genera una URL propia en `/writeups/slug`.

Guarda capturas en `public/images/` y usa `![Descripción](/images/captura.png)`. Los bloques de código tienen resaltado de sintaxis. La búsqueda filtra nombre, plataforma, sistema y etiquetas; `/` enfoca el buscador.

Las tres máquinas son ficticias. Al añadir contenido real, retira los avisos de ejemplo del índice, artículo y página Acerca. Spotlight es el componente oficial de Aceternity, renderizado por React en el servidor sin hidratar un runtime en el cliente. El diseño respeta movimiento reducido.
