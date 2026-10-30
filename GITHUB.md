# GitHub Pages y actualizaciones

Repositorio: https://github.com/Mamut-Creator/Mamut-Creator.github.io
Web: https://mamut-creator.github.io/

La primera publicación ya está configurada. El remoto `origin` apunta a GitHub y `main` publica automáticamente. La carpeta del repositorio en este equipo es `bitacora-writeups/`.

## Primera publicación

El repositorio debe contener directamente `package.json`, `src/`, `public/` y `.github/`. En este equipo, su carpeta es `bitacora-writeups/`, que ya tiene su propio Git. No subas la carpeta contenedora con `node_modules` o los ZIP de las fuentes.

1. Crear el repositorio `Mamut-Creator.github.io` sin README ni plantilla inicial.
2. En Settings → Pages, elegir **GitHub Actions** como Source.
3. Conectar el repositorio local a GitHub y subir `main`.
4. Comprobar en Actions el resultado de **Check and publish portfolio**. La URL estará disponible cuando finalice el trabajo `deploy`.

## Añadir una máquina

Desde la carpeta del repositorio:

```powershell
git pull --ff-only
npm run new:machine -- nombre-maquina "Nombre de la máquina"
npm run dev
```

Escribe el artículo en `src/content/writeups/nombre-maquina/index.md` y añade las capturas en `images/`. Puedes previsualizarlo sin publicar. Antes de subir:

```powershell
npm test
npm run build
git add src/content/writeups/nombre-maquina
git commit -m "Añade write-up de Nombre de la máquina"
git push origin main
```

Cada push a `main` instala las dependencias del lockfile, ejecuta las pruebas y compila el sitio. Solo si esas comprobaciones pasan se publica GitHub Pages. Los pull requests se comprueban, pero no despliegan.

Para cambios de diseño amplios, usa una rama y un pull request; para una entrada revisada puedes actualizar `main` directamente. No necesitas subir `dist` manualmente ni usar una rama `gh-pages`.

## Cambiar la dirección más adelante

El workflow lee la dirección y la subruta de la configuración de Pages. No hay un usuario de GitHub incrustado en los enlaces del sitio. Si usas otro repositorio o un dominio propio, ajusta Pages y vuelve a ejecutar el workflow. Si cambia la URL pública, actualiza los enlaces que compartiste. El nombre visible, Jorge Romero, se gestiona por separado en `src/lib/site.ts`.

## Probar una subruta localmente

```powershell
$env:SITE_URL='https://mamut-creator.github.io'
$env:BASE_PATH='/portfolio-check'
npm run build
npm run preview
```

Al terminar, en esa misma consola elimina esas dos variables (`Remove-Item Env:SITE_URL, Env:BASE_PATH`) para volver al modo local habitual.
