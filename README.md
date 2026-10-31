# Casa & Cocina · web

Web estática (Vite) para Casa & Cocina, C/ Solís 4, Ceuta. Se publica en Netlify desde GitHub.

## Comandos

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ (lo que publica Netlify)
```

## Estructura

- `index.html`: todas las secciones (inicio, la tienda, catálogo, contacto, horario, prensa, reseñas).
- `src/main.js`: arranque, intro (palabras + "&" de neón + vídeo), cúpula granate, scroll suave (Lenis), animaciones (GSAP), menú.
- `src/catalog.js`: catálogo a pantalla completa (un vídeo por sección) + panel de "productos ejemplares".
- `public/video/`: vídeos de Seedance 2.0 (ver `scripts/seedance.md`).
- `src/search.js`: buscador sobre todo el listado (`public/data/buscador.json`).
- `src/hours.js`: horario y estado "abierto/cerrado" (hora de Ceuta).
- `src/i18n.js`: textos en español e inglés.
- `src/config.js`: enlace de reseñas de Google y páginas legales (Lawwwing). Mientras estén vacíos, la web oculta esos enlaces.

## Actualizar el catálogo

Los datos salen del Excel del cliente, que **no** se sube al repositorio (tiene precios de compra).

1. Dejar el Excel actualizado en la carpeta padre (`../CASA&COCINA LISTADO ARTÍCULOS.xlsx`).
2. `node scripts/build-catalog.mjs` → regenera `src/data/categorias.json` y `public/data/buscador.json`.
3. Commit y push: Netlify publica solo.

Solo se leen las columnas Descripción, Familias y Pvp Tarifa General.

### Añadir un producto ejemplar

1. Foto real del producto (de la tienda) en `public/img/` (WebP, ~560 px).
2. Añadirlo en `scripts/catalog-config.mjs` → `EJEMPLARES[categoría]` con marca, nombre (es/en) e imagen.
   Si el modelo aparece tal cual en el Excel, añadir `precio: { re: /NOMBRE EN EL EXCEL/ }` para mostrar "desde X €".
3. `node scripts/build-catalog.mjs`, commit y push.

Nunca usar imágenes generadas por IA para representar productos.

## Otros scripts (solo si cambian las fotos originales)

- `node scripts/build-assets.mjs`: recortes y optimización de fotos reales (productos, fachada).
- `node scripts/build-map.mjs`: mapa estático (OpenStreetMap, sin cookies).
- `node scripts/build-icons.mjs`: favicon y apple-touch-icon.

## Pendiente antes de publicar

- Textos legales con Lawwwing → URLs en `src/config.js` (y su banner de cookies, si se añade analítica u otros servicios).
- Enlace de reseñas de Google (cuando la ficha de Google Business esté verificada) → `src/config.js`.
- Cuando haya dominio: añadir `url` al JSON-LD de `index.html`, `og:url`, URLs absolutas en `og:image` y un `sitemap.xml`.
