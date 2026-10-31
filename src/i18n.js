// Textos de la web en español (por defecto) e inglés.
const DICT = {
  es: {
    "op.tag": "Menaje, cocina<br />y hogar en Ceuta",
    "op.addr": "Calle Solís, 4<br />más de 30 años abiertos",
    "op.cta": "Ver catálogo",
    "op.call": "Llamar al 956 51 29 87",
    "tienda.eyebrow": "La tienda",
    "tienda.statement": "Casa & Cocina es una tienda de menaje y hogar en el centro de Ceuta. Empezamos en la calle Velarde y hoy te esperamos en la calle Solís.",
    "tienda.hand": "más de 30 años",
    "tienda.ribbon": "Variedad de productos / Variedad de precios / Un trato de casa / Variedad de productos / Variedad de precios / Un trato de casa",
    "catalogo.eyebrow": "El catálogo",
    "catalogo.title": "Catorce secciones, más de 13.000 artículos",
    "catalogo.lead": "Desliza para recorrer la tienda. Pulsa una sección para ver sus productos.",
    "catalogo.buscar": "Buscar un artículo concreto",
    "cat.ver": "Ver productos",
    "cat.count": "{n} artículos en tienda",
    "panel.kicker": "nuestros productos ejemplares",
    "contacto.eyebrow": "Contacto",
    "horario.eyebrow": "Cuándo venir",
    "horario.today": "hoy",
    "resenas.hand": "¡te necesitamos!",
    skip: 'Saltar al catálogo',
    'nav.catalogo': 'Catálogo', 'nav.contacto': 'Contacto', 'nav.horario': 'Horario', 'nav.resenas': 'Reseñas',
    'nav.llamar': 'Llamar', 'nav.menu': 'Menú',
    'hero.kicker': 'Bienvenidos',
    'hero.sub': 'Más de 30 años equipando las casas y cocinas de Ceuta, en la calle Solís, 4.',
    'hero.cta': 'Ver catálogo',
    'hero.scroll': 'Desliza para entrar',
    'entrada.l1': 'Pasa, estás en casa.',
    'entrada.l2': 'Empezamos en la calle Velarde. Hoy te esperamos en la calle Solís.',
    'banner.ver': 'Ver productos',
    'banner.count': '{n} artículos en tienda',
    'sheet.title': 'Nuestros productos ejemplares',
    'sheet.desde': 'desde',
    'sheet.wa': 'Preguntar por WhatsApp',
    'sheet.more': 'En tienda hay muchos más modelos de esta sección.',
    'sheet.buscarCat': 'Buscar en {cat}',
    'sheet.empty': 'Aún no hemos fotografiado esta sección, pero en tienda tenemos {n} artículos. Búscalos aquí o pregúntanos.',
    'sheet.close': 'Cerrar',
    'search.label': 'Buscar artículo',
    'search.placeholder': 'Sartén 28 cm, cafetera, termo…',
    'search.all': 'Todo',
    'search.loading': 'Cargando el catálogo…',
    'search.hint': 'Escribe lo que buscas: un artículo, una medida o una marca.',
    'search.none': 'No encontramos «{q}». Prueba con otra palabra o pregúntanos por WhatsApp.',
    'search.count': '{n} resultados',
    'search.more': 'Ver más resultados',
    'search.error': 'No se ha podido cargar el catálogo. Revisa tu conexión e inténtalo de nuevo.',
    'search.names': '',
    'contacto.title': 'Llámanos o escríbenos',
    'contacto.lead': 'Para pedir algo, preguntar por un artículo o resolver cualquier duda.',
    'contacto.donde': 'Dónde estamos',
    'contacto.comoLlegar': 'Cómo llegar',
    'festivo.q': '¿Es festivo? Llámanos antes de venir',
    'festivo.a': 'En días festivos el horario puede cambiar. Llámanos al 956 51 29 87 y te confirmamos si estamos abiertos.',
    'horario.title': 'Horario',
    'horario.closed': 'Cerrado',
    'horario.now': 'Ahora',
    'status.open': 'Abierto ahora, cerramos a las {t}',
    'status.opensToday': 'Cerrado, abrimos hoy a las {t}',
    'status.opensTomorrow': 'Cerrado, abrimos mañana a las {t}',
    'status.opensDay': 'Cerrado, abrimos el {d} a las {t}',
    days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    'medios.title': 'Nos han visitado',
    'medios.play': 'Reproducir vídeo',
    'medios.yt': 'Al reproducirlo se cargará contenido de YouTube.',
    'medios.fb': 'Al reproducirlo se cargará contenido de Facebook.',
    'resenas.title': 'Para construir esta sección, ¡te necesitamos a ti!',
    'resenas.lead': '¿Ya nos conoces? Cuenta cómo te hemos atendido. Tu opinión ayuda a que más gente nos encuentre.',
    'resenas.cta': 'Dejar una reseña en Google',
    'resenas.soon': 'Muy pronto podrás dejarla en Google desde aquí.',
    'legal.aviso': 'Aviso legal', 'legal.privacidad': 'Privacidad', 'legal.cookies': 'Cookies',
    prev: 'Anterior', next: 'Siguiente',
  },
  en: {
    "op.tag": "Cookware, kitchen<br />& home in Ceuta",
    "op.addr": "Calle Solís 4<br />open for over 30 years",
    "op.cta": "Browse catalogue",
    "op.call": "Call 956 51 29 87",
    "tienda.eyebrow": "The shop",
    "tienda.statement": "Casa & Cocina is a cookware and homeware shop in the centre of Ceuta. We started on Calle Velarde and today you will find us on Calle Solís.",
    "tienda.hand": "over 30 years",
    "tienda.ribbon": "A wide range of products / A wide range of prices / Friendly, personal service / A wide range of products / A wide range of prices / Friendly, personal service",
    "catalogo.eyebrow": "The catalogue",
    "catalogo.title": "Fourteen sections, over 13,000 items",
    "catalogo.lead": "Scroll to walk through the shop. Tap a section to see its products.",
    "catalogo.buscar": "Search for a specific item",
    "cat.ver": "See products",
    "cat.count": "{n} items in store",
    "panel.kicker": "a few of our products",
    "contacto.eyebrow": "Contact",
    "horario.eyebrow": "When to visit",
    "horario.today": "today",
    "resenas.hand": "we need you!",
    skip: 'Skip to catalogue',
    'nav.catalogo': 'Catalogue', 'nav.contacto': 'Contact', 'nav.horario': 'Opening hours', 'nav.resenas': 'Reviews',
    'nav.llamar': 'Call', 'nav.menu': 'Menu',
    'hero.kicker': 'Welcome',
    'hero.sub': 'Over 30 years equipping the homes and kitchens of Ceuta, at Calle Solís 4.',
    'hero.cta': 'Browse catalogue',
    'hero.scroll': 'Scroll to come in',
    'entrada.l1': 'Come in, make yourself at home.',
    'entrada.l2': 'We started on Calle Velarde. Today you will find us on Calle Solís.',
    'banner.ver': 'See products',
    'banner.count': '{n} items in store',
    'sheet.title': 'A few of our products',
    'sheet.desde': 'from',
    'sheet.wa': 'Ask on WhatsApp',
    'sheet.more': 'There are many more models from this section in store.',
    'sheet.buscarCat': 'Search {cat}',
    'sheet.empty': 'We have not photographed this section yet, but we have {n} items in store. Search for them here or ask us.',
    'sheet.close': 'Close',
    'search.label': 'Search for an item',
    'search.placeholder': 'Sartén 28 cm, cafetera, termo…',
    'search.all': 'All',
    'search.loading': 'Loading the catalogue…',
    'search.hint': 'Type what you are looking for: an item, a size or a brand. Item names are in Spanish (e.g. sartén = frying pan).',
    'search.none': 'No results for “{q}”. Try another word or ask us on WhatsApp.',
    'search.count': '{n} results',
    'search.more': 'Show more results',
    'search.error': 'The catalogue could not be loaded. Check your connection and try again.',
    'contacto.title': 'Call or message us',
    'contacto.lead': 'To order something, ask about an item or get an answer to any question.',
    'contacto.donde': 'Find us',
    'contacto.comoLlegar': 'Get directions',
    'festivo.q': 'Public holiday? Call before you come',
    'festivo.a': 'Opening hours may change on public holidays. Call us on +34 956 51 29 87 and we will confirm whether we are open.',
    'horario.title': 'Opening hours',
    'horario.closed': 'Closed',
    'horario.now': 'Now',
    'status.open': 'Open now, closing at {t}',
    'status.opensToday': 'Closed, opening today at {t}',
    'status.opensTomorrow': 'Closed, opening tomorrow at {t}',
    'status.opensDay': 'Closed, opening on {d} at {t}',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    'medios.title': 'In the media',
    'medios.play': 'Play video',
    'medios.yt': 'Playing it will load content from YouTube.',
    'medios.fb': 'Playing it will load content from Facebook.',
    'resenas.title': 'We need you to build this section!',
    'resenas.lead': 'Already know us? Tell everyone how we looked after you. Your review helps more people find us.',
    'resenas.cta': 'Leave a Google review',
    'resenas.soon': 'Soon you will be able to leave it on Google from here.',
    'legal.aviso': 'Legal notice', 'legal.privacidad': 'Privacy', 'legal.cookies': 'Cookies',
    prev: 'Previous', next: 'Next',
  },
};

const listeners = new Set();
let lang = 'es';

export function t(key, vars = {}) {
  const v = DICT[lang][key] ?? DICT.es[key] ?? key;
  return typeof v === 'string' ? v.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') : v;
}
export const getLang = () => lang;
export const onLang = (fn) => listeners.add(fn);

export function setLang(next, { persist = true } = {}) {
  lang = next === 'en' ? 'en' : 'es';
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  document.querySelector('[data-search-input]')?.setAttribute('placeholder', t('search.placeholder'));
  document.querySelectorAll('[data-panel-close], [data-search-close]').forEach((b) => b.setAttribute('aria-label', t('sheet.close')));
  if (persist) { try { localStorage.setItem('cyc-lang', lang); } catch {} }
  listeners.forEach((fn) => fn(lang));
}

export function initLang() {
  let initial = 'es';
  const q = new URLSearchParams(location.search).get('lang');
  if (q) initial = q;
  else { try { initial = localStorage.getItem('cyc-lang') || 'es'; } catch {} }
  setLang(initial, { persist: false });
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
}

// Formato de precio: "33 €" / "€33", con decimales solo si hacen falta
export function price(n) {
  const opts = { style: 'currency', currency: 'EUR', minimumFractionDigits: Number.isInteger(n) ? 0 : 2 };
  return new Intl.NumberFormat(lang === 'en' ? 'en-IE' : 'es-ES', opts).format(n);
}
export function number(n) {
  return new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'es-ES').format(n);
}
