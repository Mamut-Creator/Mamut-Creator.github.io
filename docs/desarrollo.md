# Desarrollo y contenido

Guía técnica del portfolio. Para el flujo de publicación, consulta [mantenimiento.md](mantenimiento.md).

Desarrollo: `npm install` y `npm run dev`. Producción: `npm run build`. Vista previa: `npm run preview`.

Para añadir una máquina, ejecuta `npm run new:machine -- nombre-maquina "Título"` o copia `templates/maquina/` a `src/content/writeups/nombre/`. Cambia el frontmatter de `index.md`. El slug debe ser único, en minúsculas y sin espacios. Las dificultades son `Fácil`, `Media` y `Difícil`. Cada carpeta genera una URL propia en `/writeups/slug`. Los títulos `##` forman el índice automáticamente.

Guarda todas las imágenes en la carpeta `images/` de la máquina. Inclúyelas con `![Descripción](./images/captura.png)`. Para una imagen con enlace: `[![Descripción](./images/captura.png)](https://destino.example)`. Astro procesa las imágenes locales. El campo `cover` indica una portada relativa a la carpeta de la máquina y `machineUrl` enlaza con su página en la plataforma. Las portadas del carrusel abren el write-up; la portada del artículo y el enlace «Ir a la máquina» abren `machineUrl`.

Escribe bloques con tres acentos graves seguidos del lenguaje (`bash`, `python`, `powershell`, `javascript`, `json` o `text` para salida de herramientas). Todos se muestran en una terminal visual con resaltado y botón Copiar. Se representan como documentación: no ejecutan los comandos. La búsqueda filtra nombre, plataforma, sistema y etiquetas; `/` enfoca el buscador.

Usa `status: resuelta` para incluir una máquina real en el carrusel, navegable con flechas, teclado y desplazamiento táctil. No tiene avance automático. Las máquinas ficticias se conservan en `examples/`, fuera de las páginas publicadas. El archivo muestra un estado vacío hasta que añadas contenido real. No se muestran estadísticas inventadas.

## Imágenes y comandos

Las imágenes sin enlace abren el visor al pulsarlas. Si la imagen tiene un enlace, conserva ese destino y aparece un botón independiente «Ampliar captura». El visor permite recorrer imágenes con las flechas o el teclado, ajustar/ampliar y cerrar con Escape. El texto alternativo sirve como pie de imagen. Al cerrar vuelves al punto del artículo donde estabas.

Para destacar líneas, añade los números al lenguaje del bloque, por ejemplo `bash {2,4-6}`. Los números empiezan en 1. El botón Copiar conserva el código original, sin números ni etiquetas de formato. Consulta `examples/nebula/index.md` para ver ejemplos completos.

Prueba del parser de líneas: `node --test tests/line-highlight.test.mjs` desde esta carpeta. Los archivos de `dist/` y `outputs/` se generan, no se versionan.

Spotlight es el componente oficial de Aceternity, renderizado por React en el servidor. El diseño respeta movimiento reducido. Puedes iniciar el sitio tanto desde esta carpeta como desde la carpeta principal: `npm install` y `npm run dev`. Si PowerShell bloquea `npm.ps1`, usa `npm.cmd install` y `npm.cmd run dev`.

## Tipografías y movimiento

Las fuentes se sirven localmente desde `public/fonts/`: Maple Mono para texto e interfaz, JetBrains Mono para código y WindSong para cursiva. Sus licencias están en la misma carpeta. Los estilos están en `src/styles/motion.css`.

El título usa `Typewriter.astro` y la animación se controla en `PageMotion.astro`, junto con las apariciones al desplazarse. El contenido sigue visible sin JavaScript. Si el visitante pide movimiento reducido, se muestra el texto completo y se desactivan las animaciones.

El fondo utiliza columnas tenues de caracteres en cascada (`src/components/CodeRain.astro`). La animación es CSS, deja el centro más despejado para leer y reduce la cantidad de columnas en móvil. Se pausa al ocultar la pestaña y permanece estática con movimiento reducido. El espaciado de la portada y el tamaño del título están en `src/styles/hero.css`.

## Móvil y Safari

`src/styles/responsive.css` concentra los ajustes para pantallas pequeñas: tipografía, áreas táctiles, comandos con desplazamiento propio y visor centrado. La luz decorativa queda recortada en su contenedor para que no ensanche la página. El efecto de escritura revela caracteres sin depender de Web Animations; las entradas de contenido usan transiciones CSS y se restablecen al volver desde la caché de navegación.

Las máscaras del fondo incluyen el prefijo de WebKit. Por defecto se respeta el movimiento reducido del sistema. El botón del pie permite activar o pausar las animaciones explícitamente y recuerda esa elección en el navegador. Las animaciones de entrada esperan a que la página esté visible y no quedan bloqueadas si la carga de las fuentes se retrasa. Las comprobaciones de tamaño en el navegador de escritorio no sustituyen la prueba en un dispositivo iOS real.

La luz se coloca en una capa del ancho de la pantalla con desvanecido vertical. Su contenedor no depende del tamaño del título ni de la caja de la cabecera, para evitar bordes rectangulares visibles.

## Lectura de artículos largos

El campo opcional `icon: images/logo.png` permite usar el logo limpio junto al título (84 px en escritorio, 64 px en móvil), separado de `cover`. Las tarjetas muestran el icono centrado sobre un degradado metálico gris azulado con un reflejo verde tenue; el archivo muestra solo el icono circular, sin panel. Si no se define `icon`, esas vistas usan un símbolo del sistema operativo. No hace falta repetir el logo dentro del artículo. Para una portada horizontal dentro del Markdown usa `![Portada de la máquina](./images/portada.webp "portada")`: queda centrada, con un ancho máximo de 400 px, sin afectar al tamaño de las capturas.

`ArticleIndex.astro` marca la sección actual con `aria-current="location"` y actualiza el fragmento de la URL al desplazarse mediante `history.replaceState`, conservando los parámetros de consulta y sin llenar el historial. Los enlaces del índice mantienen el salto nativo a sus encabezados.

La escala compartida de texto se define en `typography.css`, cargado después de los ajustes responsive. El cuerpo general usa 17 px en escritorio y 16 px en móvil; los artículos usan 19 y 18 px respectivamente, con terminales de 16 y 15 px. Los títulos de sección generales comparten 30 y 26 px; los del artículo usan 32 y 28 px. El índice lateral permite desplazamiento propio si supera la altura de la ventana.

No apliques animaciones de aparición a `.reading-layout` ni a `.prose`: un artículo largo puede no alcanzar el porcentaje visible que espera un observador y transformar su contenedor afecta al índice sticky. `PageMotion.astro` anima elementos pequeños y encabezados de sección; el contenido ya alcanzado queda visible al restaurar la pestaña. La barra flotante de desarrollo de Astro está desactivada mediante `devToolbar.enabled` en `astro.config.mjs`.
