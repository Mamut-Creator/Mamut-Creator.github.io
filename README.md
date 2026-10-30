# Bitácora · Astro + Aceternity UI

Desarrollo: `npm install` y `npm run dev`. Producción: `npm run build`. Vista previa: `npm run preview`.

Para añadir una máquina, copia `templates/maquina/` a `src/content/writeups/nombre/`. Cambia el frontmatter de `index.md`. El slug debe ser único, en minúsculas y sin espacios. Las dificultades son `Fácil`, `Media` y `Difícil`. Cada carpeta genera una URL propia en `/writeups/slug`. Los títulos `##` forman el índice automáticamente.

Guarda todas las imágenes en la carpeta `images/` de la máquina. Inclúyelas con `![Descripción](./images/captura.png)`. Para una imagen con enlace: `[![Descripción](./images/captura.png)](https://destino.example)`. Astro procesa las imágenes locales. El campo `cover` indica una portada relativa a la carpeta de la máquina y `machineUrl` enlaza con su página en la plataforma. Las portadas del carrusel abren el write-up; la portada del artículo y el enlace «Ir a la máquina» abren `machineUrl`.

Escribe bloques con tres acentos graves seguidos del lenguaje (`bash`, `python`, `powershell`, `javascript`, `json` o `text` para salida de herramientas). Todos se muestran en una terminal visual con resaltado y botón Copiar. Se representan como documentación: no ejecutan los comandos. La búsqueda filtra nombre, plataforma, sistema y etiquetas; `/` enfoca el buscador.

Usa `status: resuelta` para incluir la máquina en el carrusel, navegable con flechas, teclado y desplazamiento táctil. No tiene avance automático. `demo: true` identifica una entrada ficticia; cámbialo a `false` al publicar una resolución propia. Los enlaces actuales son los catálogos de las plataformas porque las máquinas de muestra son ficticias.

Spotlight es el componente oficial de Aceternity, renderizado por React en el servidor. El diseño respeta movimiento reducido. Puedes iniciar el sitio tanto desde esta carpeta como desde la carpeta principal: `npm install` y `npm run dev`. Si PowerShell bloquea `npm.ps1`, usa `npm.cmd install` y `npm.cmd run dev`.

## Tipografías y movimiento

Las fuentes se sirven localmente desde `public/fonts/`: Maple Mono para texto e interfaz, JetBrains Mono para código y WindSong para cursiva. Sus licencias están en la misma carpeta. Los estilos están en `src/styles/motion.css`.

El título usa `Typewriter.astro` y la animación se controla en `PageMotion.astro`, junto con las apariciones al desplazarse. El contenido sigue visible sin JavaScript. Si el visitante pide movimiento reducido, se muestra el texto completo y se desactivan las animaciones.

La portada dibuja un planeta ASCII con el ojo de la referencia de Nmap aportada por el usuario mediante Canvas 2D. `src/lib/ascii-planet.ts` muestrea la zona del ojo de `public/images/nmap-eye-reference.png`, la proyecta como caracteres sobre una esfera y vincula su rotación al scroll de la cabecera. No hay giro automático ni dependencia de WebGL o Three.js. Solo se dibuja al cambiar el scroll o el tamaño; fuera de pantalla se pausa. Con movimiento reducido se conserva el dibujo estático. Sin JavaScript queda un ojo ASCII en HTML. Si falla la carga de la referencia se usa un ojo procedural de reserva. Tamaño y posición: `src/styles/ascii-planet.css`.
