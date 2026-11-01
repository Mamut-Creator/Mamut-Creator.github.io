# Guía para mantener y publicar los write-ups

## Proyecto y publicación

Este es el portfolio de **Jorge Romero**. La raíz del repositorio es esta carpeta, `bitacora-writeups/`; ejecuta aquí los comandos de Git y npm.

- Repositorio: https://github.com/Mamut-Creator/Mamut-Creator.github.io
- Web: https://mamut-creator.github.io/
- Rama publicada: `main`, mediante `.github/workflows/pages.yml` y GitHub Pages.
- Jorge aporta los artículos y las capturas; el agente prepara, revisa y gestiona las subidas solicitadas. Editar archivos o crear un commit local no actualiza la web: hace falta un push y que el despliegue termine correctamente.
- Mantén el README público como presentación del portfolio. Las instrucciones técnicas van en `docs/` y en este archivo.

## Dónde va cada cosa

```text
src/content/writeups/
  nombre-maquina/
    index.md              # Artículo real y sus metadatos
    images/               # Capturas y portada de esa máquina
templates/maquina/        # Plantilla reutilizable; conservar
examples/                 # Máquinas FICTICIAS; fuera del sitio publicado
  nebula/
  cipher/
  archive/
docs/                     # Guías técnicas y de mantenimiento
```

**La carpeta de los ejemplos es `examples/`, en la raíz de este repositorio** (desde la carpeta principal del workspace: `bitacora-writeups/examples/`). Está versionada en GitHub, pero Astro no la incluye en la web. No son máquinas resueltas por Jorge y no deben presentarse como tales.

Jorge quiere eliminar esos ejemplos después de escribir el primer write-up real. Consérvalos hasta entonces. Al completar ese primer artículo, retira `examples/` y actualiza las referencias a sus archivos en la documentación. Conserva `templates/maquina/`, las pruebas y los artículos reales. Antes de eliminar recursivamente, verifica que la ruta absoluta corresponde exactamente a la carpeta `examples` de este repositorio. No copies ejemplos al contenido publicado; si los usas temporalmente para comprobar el diseño, retíralos antes del build final y del commit.

## Añadir un write-up

1. Revisa `git status` y los cambios existentes. Conserva el trabajo ajeno a la petición. Con el árbol limpio, sincroniza mediante `git pull --ff-only`; si hay cambios locales, no los descartes ni los sobrescribas para sincronizar.
2. Crea la máquina:

   ```powershell
   npm run new:machine -- nombre-maquina "Nombre de la máquina"
   ```

   El comando usa `templates/maquina/`, crea `src/content/writeups/nombre-maquina/` y evita sobrescribir carpetas existentes. Usa un slug único, en minúsculas, sin tildes ni espacios, separado por guiones. Mantén iguales el nombre de carpeta y el campo `slug`.
3. Completa `index.md` y añade las imágenes dentro de su propia carpeta `images/`. Usa la plantilla como referencia para los metadatos:

   ```yaml
   ---
   title: Nombre de la máquina
   slug: nombre-maquina
   platform: Hack The Box
   os: Linux
   difficulty: Fácil
   tags: [Web, Enumeración]
   summary: Una frase concreta sobre el aprendizaje principal.
   status: resuelta
   demo: false
   cover: images/cover.png
   machineUrl: https://app.hackthebox.com/machines/ENLACE-REAL
   ---
   ```

   Sustituye los valores de muestra por datos reales. Las dificultades son `Fácil`, `Media` y `Difícil`. `status: resuelta` incluye la máquina en el carrusel de resueltas. `cover` y `machineUrl` son opcionales: omítelos si no tienes la imagen o el enlace; no publiques destinos ficticios. La portada debe existir y la URL debe ser HTTP(S).
4. Organiza el contenido con títulos `##`: generan el índice automáticamente. Documenta el razonamiento, los comandos, sus resultados y los aprendizajes sin inventar pasos ni evidencias.
5. Previsualiza con `npm run dev`. **No existe un filtro de borradores**: los archivos `src/content/writeups/*/index.md` se incluyen en la compilación. No subas a `main` un artículo incompleto pensando que `demo` o `status` lo ocultarán. Usa una rama sin desplegar para trabajo en curso.

## Capturas y comandos

- Imagen: `![Descripción de la captura](./images/enumeracion.png)`.
- Imagen con destino: `[![Descripción](./images/captura.png)](https://destino.example)`; reemplaza el destino antes de publicar.
- Usa nombres de archivo descriptivos y rutas relativas. Las imágenes sin enlace abren el visor; las enlazadas conservan su destino y disponen de un botón independiente para ampliarlas.
- Usa bloques Markdown con tres acentos graves y lenguaje (`bash`, `powershell`, `python`, `json` o `text` para salidas). Se muestran como terminal con resaltado y botón Copiar. **Los comandos se documentan; no se ejecutan desde la web.**
- Para destacar líneas, añade la selección tras el lenguaje: `bash {2,4-6}`. La numeración comienza en 1.
- Comprueba que comandos largos e imágenes se puedan consultar en móvil sin ensanchar toda la página. No publiques credenciales personales, tokens o datos privados presentes en las capturas o salidas.

## Revisar y subir

Desde la raíz del repositorio, antes de publicar contenido o código:

```powershell
npm test
npm run build
npm run check:build
git diff --check
git status --short
```

Revisa el artículo en escritorio y móvil: imágenes, portada, enlaces, índice, terminales, copia y visor. No afirmes haber probado Safari en un iPhone si solo comprobaste tamaños móviles en un navegador de escritorio. No hace falta repetir pruebas del sitio por una modificación exclusivamente documental.

Para una publicación solicitada, prepara un commit con los archivos concretos de la actualización y revisa `git diff --cached` antes de subir. Por ejemplo:

```powershell
git add src/content/writeups/nombre-maquina
git diff --cached
git commit -m "Añade write-up de Nombre de la máquina"
git push origin main
```

Incluye también cualquier cambio asociado y revisado en la documentación, como la retirada de los ejemplos tras el primer artículo. No uses `git add .` sin revisar el resto del trabajo ni hagas force push. Para cambios amplios de diseño, utiliza una rama y un pull request.

Cada push a `main` inicia las comprobaciones y la publicación automática. Los pull requests se comprueban pero no despliegan. Verifica el resultado del workflow en GitHub Actions y la URL final del artículo (`/writeups/nombre-maquina/`); si no puedes verificarlo, informa de ello sin dar el despliegue por terminado.

No subas `dist/`, `node_modules/`, `.astro/`, `outputs/`, archivos `.env` ni configuración del antiguo alojamiento `.openai/`. No recrees ese alojamiento: el destino es GitHub Pages. Conserva la compatibilidad con `BASE_PATH` en enlaces internos y recursos.

## Referencias

- [Desarrollo, contenido y componentes](docs/desarrollo.md)
- [Mantenimiento y GitHub Pages](docs/mantenimiento.md)
- [Plantilla de máquina](templates/maquina/index.md)
