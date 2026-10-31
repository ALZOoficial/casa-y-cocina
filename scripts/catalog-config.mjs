// Configuración del catálogo: categorías (agrupan las familias del Excel) y
// "productos ejemplares" (solo productos que aparecen en las fotos/vídeos reales de la tienda).
//
// Para añadir un producto ejemplar: añadir una entrada en EJEMPLARES con su foto en public/img
// y, si está en el Excel, un `precio` con la expresión que lo identifica sin ambigüedad.
// Después: node scripts/build-catalog.mjs

export const CATEGORIAS = [
  { id: 'sartenes', es: 'Sartenes, woks y planchas', en: 'Frying pans, woks & griddles', img: 'cat-sartenes.webp',
    familias: ['SARTENES', 'PLANCHAS', 'GRILL', 'PAELLERA', 'GRILL / SARTENES / PLANCHAS'] },
  { id: 'ollas', es: 'Ollas y cacerolas', en: 'Pots & casseroles', img: 'cat-ollas.webp',
    familias: ['OLLAS', 'CACEROLAS', 'CACEROLA', 'CAZO', 'CAZOS', 'BATERÍA DE COCINA', 'OLLAS / CACEROLAS / CAZOS'] },
  { id: 'cafe', es: 'Café y té', en: 'Coffee & tea', img: 'cat-cafe.webp',
    familias: ['CAFETERA', 'TETERA', 'HERVIDOR DE AGUA', 'REPUESTOS CAFÉ', 'CHOCOLATERA'] },
  { id: 'electro', es: 'Pequeño electrodoméstico', en: 'Small appliances', img: 'cat-electro.webp',
    familias: ['PEQ. ELECTRODOMÉSTICO', 'BATIDORA', 'FREIDORAS', 'HORNOS', 'MICROONDAS'] },
  { id: 'cuchillos', es: 'Cuchillos', en: 'Knives', img: null,
    familias: ['CUCHILLOS'] },
  { id: 'utensilios', es: 'Utensilios de cocina', en: 'Kitchen tools', img: 'cat-utensilios.webp',
    familias: ['ACCESORIOS COCINA', 'MENAJE COCINA', 'REPUESTOS COCINA', 'REPUESTO COCINA', 'REPUESTOS'] },
  { id: 'reposteria', es: 'Repostería y horno', en: 'Baking & oven', img: 'cat-reposteria.webp',
    familias: ['MOLDES', 'ACCESORIOS REPOSTERÍA', 'RUSTIDERAS', 'MOLDES / RUSTIDERAS'] },
  { id: 'vajilla', es: 'Vajilla y mesa', en: 'Tableware', img: 'cat-vajilla.webp',
    familias: ['VAJILLA', 'CUENCO', 'TAZA', 'FUENTES', 'BANDEJAS', 'PZAS. SERVIR', 'FUENTES / BANDEJAS'] },
  { id: 'cuberteria', es: 'Cubertería', en: 'Cutlery', img: null,
    familias: ['CUBERTERÍA', 'CUBERTERIA / PZAS. SERVIR'] },
  { id: 'cristaleria', es: 'Cristalería y vino', en: 'Glassware & wine', img: 'cat-cristaleria.webp',
    familias: ['VASOS', 'COPAS', 'ACCESORIOS VINOS', 'ART. VINOS', 'ACCESORIOS VINO', 'BOTELLERO'] },
  { id: 'termos', es: 'Termos y botellas', en: 'Flasks & bottles', img: 'cat-termos.webp',
    familias: ['TERMOS', 'BOTELLA ISOTÉRMICA', 'BOTELLA ISOTHERMICA'] },
  { id: 'hogar', es: 'Planchado y hogar', en: 'Ironing & home', img: 'cat-hogar.webp',
    familias: ['PLANCHA VAPOR', 'TABLA PLANCHA', 'ASPIRADOR', 'VAPORETA', 'TENDEDERO', 'VENTILADOR', 'CALEFACTOR',
      'ACCESORIOS BAÑO', 'ACCESORIOS MENAJE HOGAR', 'HOGAR', 'BOLSAS', 'RELOJ'] },
  { id: 'cuidado', es: 'Cuidado personal', en: 'Personal care', img: 'cat-cuidado.webp',
    familias: ['CUIDADO PERSONAL', 'REPUESTO CUIDADO PERSONAL', 'AFEITADORAS', 'CORTAPELOS', 'PLANCHA PELO', 'AFEITADORAS / CORTAPELOS'] },
  { id: 'infantil', es: 'Infantil', en: 'Kids', img: 'cat-infantil.webp',
    familias: ['NIÑO'] },
];

// `precio`: { re, fam? } -> "desde" = PVP mínimo (>0) de las filas del Excel cuya descripción
// cumple `re` (y cuya familia está en `fam`, si se indica). Solo se pone cuando el modelo
// aparece nombrado tal cual en el Excel; si no, la tarjeta va sin precio.
export const EJEMPLARES = {
  sartenes: [
    { marca: 'Kuhn Rikon', es: 'Allround, paellera 36 cm', en: 'Allround paella pan, 36 cm', img: 'p-kr-paella.webp' },
    { marca: 'Kuhn Rikon', es: 'Easy Induction 26 cm', en: 'Easy Induction, 26 cm', img: 'p-kr-easy26.webp' },
    { marca: 'Kuhn Rikon', es: 'Allround Wok', en: 'Allround Wok', img: 'p-kr-wok.webp' },
    { marca: 'Kuhn Rikon', es: 'Easy Induction Grill', en: 'Easy Induction Grill', img: 'p-kr-grill.webp' },
    { marca: 'Kuhn Rikon', es: 'Easy Induction Marble', en: 'Easy Induction Marble', img: 'p-kr-marble.webp' },
    { marca: 'Le Creuset', es: 'Wok antiadherente', en: 'Non-stick wok', img: 'p-lc-wok.webp' },
    { marca: 'Le Creuset', es: 'Sartenes antiadherentes', en: 'Non-stick frying pans', img: 'p-lc-sarten.webp' },
    { marca: 'BRA', es: 'The One Titanium', en: 'The One Titanium', img: 'p-bra-one.webp' },
    { marca: 'Tefal', es: 'Aroma', en: 'Aroma', img: 'p-tefal-aroma.webp', precio: { re: /\bAROMA\b/, fam: ['SARTENES'] } },
  ],
  ollas: [
    { marca: 'Le Creuset', es: 'Cocottes de hierro fundido', en: 'Cast iron casseroles', img: 'p-lc-cocottes.webp' },
    { marca: 'Le Creuset', es: 'Cocotte calabaza 24 cm', en: 'Pumpkin casserole, 24 cm', img: 'p-lc-calabaza.webp', precio: { re: /^COCOTTE CALABAZA 24CM/ } },
    { marca: 'Kuhn Rikon', es: 'Ollas a presión Duromatic', en: 'Duromatic pressure cookers', img: 'p-kr-duromatic.webp', precio: { re: /^DUROMATIC/ } },
    { marca: 'Kuhn Rikon', es: 'Ollas de acero inoxidable', en: 'Stainless steel pots', img: 'p-kr-inox.webp' },
  ],
  cafe: [
    { marca: 'Bialetti', es: 'Moka Express', en: 'Moka Express', img: 'p-bia-express.webp', precio: { re: /^MOKA EXPRESS/ } },
    { marca: 'Bialetti', es: 'Moka Induction', en: 'Moka Induction', img: 'p-bia-induction.webp', precio: { re: /^NEW MOKA IND/ } },
    { marca: 'Bialetti', es: 'Brikka', en: 'Brikka', img: 'p-bia-brikka.webp', precio: { re: /^BRIKKA/ } },
    { marca: 'Monix', es: 'Cafetera italiana', en: 'Stovetop coffee maker', img: 'p-monix.webp' },
    { marca: 'Le Creuset', es: 'Hervidores esmaltados', en: 'Enamel kettles', img: 'p-lc-hervidor.webp' },
  ],
  electro: [
    { marca: 'Moulinex', es: 'Easy Fry & Grill', en: 'Easy Fry & Grill', img: 'p-mx-easyfry.webp', precio: { re: /^MOULINEX EASY FRY & GRILL/ } },
    { marca: 'Tefal', es: 'OptiGrill+ Initial', en: 'OptiGrill+ Initial', img: 'p-tefal-optigrill.webp', precio: { re: /^OPTIGRILL INITIAL/ } },
    { marca: 'Moulinex', es: 'Lightmix, batidora portátil', en: 'Lightmix portable blender', img: 'p-mx-lightmix.webp' },
  ],
  cuchillos: [],
  utensilios: [
    { marca: 'Lékué', es: 'Microwave Omelette', en: 'Microwave Omelette', img: 'p-lk-omelette.webp', precio: { re: /^OMELETTE ROJO/ } },
    { marca: 'Lékué', es: 'Microwave Spanish Omelette', en: 'Microwave Spanish Omelette', img: 'p-lk-tortilla.webp', precio: { re: /^MOLDE TORTILLA$/ } },
    { marca: 'Lékué', es: 'Microwave Ovo', en: 'Microwave Ovo', img: 'p-lk-ovo.webp' },
    { marca: 'Lékué', es: 'Glass Steam Cooker', en: 'Glass Steam Cooker', img: 'p-lk-steam.webp' },
    { marca: 'Lékué', es: 'Fuentes de cristal para freidora de aire', en: 'Air fryer glass dishes', img: 'p-lk-glassdish.webp' },
    { marca: 'Lékué', es: 'Veggie Drinks Maker', en: 'Veggie Drinks Maker', img: 'p-lk-veggiedrinks.webp' },
    { marca: 'Lékué', es: 'Kefir & Yogurt Maker', en: 'Kefir & Yogurt Maker', img: 'p-lk-kefir.webp', precio: { re: /^KIT KEFIR Y YOGURT/ } },
    { marca: 'Brita', es: 'Jarra filtrante Marella', en: 'Marella filter jug', img: 'p-brita-marella.webp', precio: { re: /MARELLA/, fam: ['ACCESORIOS COCINA', 'ACCESORIOS MENAJE HOGAR'] } },
    { marca: 'Brita', es: 'Jarra filtrante de cristal', en: 'Glass filter jug', img: 'p-brita-cristal.webp' },
    { marca: 'Le Creuset', es: 'Set de 2 manoplas', en: 'Set of 2 pot holders', img: 'p-lc-manoplas.webp' },
    { marca: 'Le Creuset', es: 'Tapa antisalpicaduras', en: 'Splatter guard', img: 'p-lc-salpicaduras.webp' },
    { marca: 'Joseph Joseph', es: 'Organizadores de cajón', en: 'Drawer organisers', img: 'p-jj-cajon.webp' },
  ],
  reposteria: [
    { marca: 'Lékué', es: 'Pan de molde 25 cm', en: 'Sandwich bread mould, 25 cm', img: 'p-lk-panmolde.webp' },
    { marca: 'Lékué', es: 'Molde Duo de silicona y cerámica', en: 'Duo silicone & ceramic mould', img: 'p-lk-duo.webp' },
    { marca: 'Lékué', es: 'Pizza & Baking Mat', en: 'Pizza & Baking Mat', img: 'p-lk-pizza.webp', precio: { re: /^PIZZA MAT$/ } },
    { marca: 'Lékué', es: 'Veggie Burger', en: 'Veggie Burger', img: 'p-lk-veggieburger.webp', precio: { re: /^VEGGIE BURGER VERDE/ } },
  ],
  vajilla: [
    { marca: 'Le Creuset', es: 'Gres esmaltado: jarras y mantequeras', en: 'Stoneware jugs & butter dishes', img: 'p-lc-gres.webp' },
    { marca: 'Le Creuset', es: 'Cuencos y platos de colores', en: 'Coloured bowls & plates', img: 'p-lc-cuencos.webp' },
    { marca: 'Tokyo Design Studio', es: 'Cuencos de estilo japonés', en: 'Japanese-style bowls', img: 'p-tokyo.webp' },
  ],
  cuberteria: [],
  cristaleria: [],
  termos: [
    { marca: 'Le Creuset', es: 'Botella isotérmica 500 ml', en: 'Insulated bottle, 500 ml', img: 'p-lc-botella.webp' },
    { marca: 'Le Creuset', es: 'Travel Mug 350 ml', en: 'Travel Mug, 350 ml', img: 'p-lc-travelmug.webp' },
    { marca: 'B Bottles', es: 'Twin', en: 'Twin', img: 'p-bbottles-twin.webp' },
  ],
  hogar: [
    { marca: 'Rowenta', es: 'X-Force Flex', en: 'X-Force Flex', img: 'p-rowenta-xforce.webp', precio: { re: /^XFORCE FLEX/ } },
    { marca: 'Brabantia', es: 'Tabla de planchar 124 × 38 cm', en: 'Ironing board, 124 × 38 cm', img: 'p-brabantia-tabla.webp' },
    { marca: 'Metaltex', es: 'Tendedero Storm 34 m', en: 'Storm drying rack, 34 m', img: 'p-metaltex-storm.webp' },
    { marca: 'Playmarket', es: 'Carro de la compra', en: 'Shopping trolley', img: 'p-playmarket.webp' },
  ],
  cuidado: [
    { marca: 'Braun', es: 'Series 9 Pro+', en: 'Series 9 Pro+', img: 'p-braun-s9.webp', precio: { re: /SERIES 9 PRO\+/ } },
    { marca: 'Braun', es: 'Satin Hair 7', en: 'Satin Hair 7', img: 'p-braun-satin.webp' },
    { marca: 'Oral-B', es: 'Cepillos eléctricos', en: 'Electric toothbrushes', img: 'p-oralb.webp' },
  ],
  infantil: [
    { marca: null, es: 'Botellas y fiambreras infantiles', en: 'Kids’ bottles & lunch boxes', img: 'p-infantil.webp' },
  ],
};
