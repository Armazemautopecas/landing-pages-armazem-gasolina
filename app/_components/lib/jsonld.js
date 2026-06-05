// JSON-LD pra cada LP gasolina. Veículo-cêntrico (sem Product peça).
// Renderiza só o AutoPartsStore (LocalBusiness) — Google Rich Results aceita
// pra páginas de captação ampla onde não tem SKU único.

const SITE_URL = 'https://www.armazemautopecas.com.br';

const AUTOPARTS_STORE = {
  '@type': 'AutoPartsStore',
  '@id': `${SITE_URL}/#business`,
  name: 'Armazém Auto Peças',
  url: SITE_URL,
  telephone: '+5549999484754',
  priceRange: '$$',
  image: `${SITE_URL}/gasolina/logo-armazem.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Igarassu, 840 D',
    addressLocality: 'Chapecó',
    postalCode: '89812-764',
    addressRegion: 'SC',
    addressCountry: 'BR',
  },
  sameAs: ['https://wa.me/5549999484754'],
};

const AGGREGATE_RATING = {
  '@type': 'AggregateRating',
  ratingValue: '4.6',
  reviewCount: '109',
  bestRating: '5',
  worstRating: '1',
};

export function buildJsonLd(cfg, pageUrl) {
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Armazém Auto Peças', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: `Peças ${cfg.veiculo.marca} ${cfg.veiculo.modelo}`, item: pageUrl },
    ],
  };

  const storeNode = {
    ...AUTOPARTS_STORE,
    aggregateRating: AGGREGATE_RATING,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [storeNode, breadcrumb],
  };
}
