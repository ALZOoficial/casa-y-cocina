# Vídeos con Seedance 2.0 (Higgsfield)

## Inicio (`public/video/inicio.mp4`, `inicio-movil.mp4`)

Vídeo de ambiente (no muestra productos de la tienda), 10 s, 1080p, 16:9:

```bash
higgsfield generate create seedance_2_0 --prompt "Slow cinematic dolly-in through a warm Mediterranean home kitchen at golden hour. Steam rises gently from an enamel cooking pot on a gas stove, light oak wooden shelves with white ceramic bowls, a deep burgundy painted wall, soft late-afternoon sunlight through a window, linen cloth and lemons on the counter. Shallow depth of field, 35mm lens, warm terracotta and cream tones, calm and homely, photoreal, uninhabited, plain unbranded objects." --duration 10 --resolution 1080p --aspect_ratio 16:9 --generate_audio false --wait
```

## Intro de la torre de platos (`public/video/torre.mp4`, `torre-movil.mp4`)

Vídeo controlado por el scroll: la cámara baja por una torre de platos y acaba en un plato granate que da paso a
«La tienda». Fotogramas inicial y final con GPT Image 2.5 (16:9 y 9:16, quality high) y vídeo con Seedance 2.5:

```bash
higgsfield generate create seedance_2_5 --mode omni_reference --start-image start_16x9.png --end-image end_16x9.png --duration 10 --resolution 1080p --aspect_ratio 16:9 --generate_audio false --bitrate_mode high --wait \
  --prompt "One continuous, perfectly smooth vertical camera move with no cuts: the camera starts level with the top of a very tall stack of handmade ceramic plates and slowly descends straight down along the side of the stack, plate after plate gliding past in bone white, olive green, terracotta and oak brown glazes, the warm blurred shop interior behind. As it nears the bottom the plates become deep burgundy red, and the camera gently pushes in until the burgundy glaze fills the whole frame. Steady elevator-like motion at constant speed, the stack stays perfectly still and solid, no plates move, warm golden light, shallow depth of field, photoreal, no people, no text."
```

Para la web, todos los fotogramas clave (`-g 1`) para que el scroll pueda moverse a cualquier instante sin tirones:

```bash
ffmpeg -i vid_16x9.mp4 -vf "scale=1600:-2,format=yuv420p" -an -c:v libx264 -preset slow -crf 24 -g 1 -tune film -movflags +faststart public/video/torre.mp4
ffmpeg -i vid_9x16.mp4 -vf "scale=720:-2,format=yuv420p" -an -c:v libx264 -preset slow -crf 25 -g 1 -tune film -movflags +faststart public/video/torre-movil.mp4
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
