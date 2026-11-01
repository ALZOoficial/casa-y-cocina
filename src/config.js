// Datos que se rellenarán más adelante. Mientras estén vacíos, la web oculta lo que dependa de ellos.

// Enlace "Escribir una reseña" de Google Business Profile (cuando la ficha esté verificada).
export const GOOGLE_REVIEW_URL = '';

// Páginas legales generadas con Lawwwing (aviso legal, privacidad, cookies).
export const LEGAL = { aviso: '', privacidad: '', cookies: '' };

export const PHONE = '+34956512987';
export const WHATSAPP = 'https://wa.me/34956512987';
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=Calle%20Sol%C3%ADs%204%2C%2051001%20Ceuta';

// Enlace de WhatsApp con el mensaje ya escrito (el cliente puede editarlo antes de enviarlo)
export const waLink = (text) => (text ? `${WHATSAPP}?text=${encodeURIComponent(text)}` : WHATSAPP);
