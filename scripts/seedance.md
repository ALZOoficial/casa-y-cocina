# Vídeos con Seedance 2.0 (Higgsfield)

## Inicio (`public/video/inicio.mp4`, `inicio-movil.mp4`)

Vídeo de ambiente (no muestra productos de la tienda), 10 s, 1080p, 16:9:

```bash
higgsfield generate create seedance_2_0 --prompt "Slow cinematic dolly-in through a warm Mediterranean home kitchen at golden hour. Steam rises gently from an enamel cooking pot on a gas stove, light oak wooden shelves with white ceramic bowls, a deep burgundy painted wall, soft late-afternoon sunlight through a window, linen cloth and lemons on the counter. Shallow depth of field, 35mm lens, warm terracotta and cream tones, calm and homely, photoreal, uninhabited, plain unbranded objects." --duration 10 --resolution 1080p --aspect_ratio 16:9 --generate_audio false --wait
```

## Secciones del catálogo (`public/video/cat/<id>.mp4`)

Cada vídeo parte de una FOTO REAL de la tienda (recorte 16:9 como primer fotograma) y Seedance solo añade
un movimiento de cámara lento. Hay que revisar cada resultado y descartar cualquiera que deforme
productos, marcas o etiquetas, o que se invente partes de la tienda.

```bash
higgsfield generate create seedance_2_0 --start-image start/<id>.jpg --duration 5 --resolution 1080p --aspect_ratio 16:9 --generate_audio false --wait \
  --prompt "Very slow, smooth cinematic push-in with gentle parallax, as if a camera glides closer to the shelf. Warm shop lights glow softly. Every product, label, logo and shelf stays exactly as in the photo, perfectly still and tack sharp. Uninhabited store, calm and steady."
```

Para la web (bucle de ida y vuelta, sin audio, 1600 px):

```bash
ffmpeg -i out/<id>.mp4 -filter_complex "[0:v]scale=1600:-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]" -map "[v]" -an -c:v libx264 -preset slow -crf 29 -movflags +faststart public/video/cat/<id>.mp4
```

El póster (`public/img/cat/<id>.webp`) es la misma foto real del primer fotograma.

Secciones sin foto real (cuchillos, cubertería, cuidado personal, infantil): imagen de ambiente generada con
Seedream 5.0 Lite (`seedream_v5_lite`, 16:9, quality high), artículos genéricos sin marca sobre pared granate y balda de roble.
No son productos reales de la tienda: sustituir por fotos reales cuando las haya (y añadir el id a `VIDEO` en `src/catalog.js` si se anima).
