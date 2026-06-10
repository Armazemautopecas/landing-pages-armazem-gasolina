const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

// Cache imutável (1 ano) pra assets que nunca mudam sem novo filename:
// - fontes self-hosted (URLs com hash no nome)
// - hero/assets de cada LP (filenames fixos por LP)
const IMMUTABLE_CACHE = [
  { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Curativo 2026-06-10: Bunny tem ~7 chunks /_next/static/chunks/* com 404
  // cacheado de 2026-06-09 19:22 GMT que não responde a "Purge Cache" do
  // painel nem a purge full repetido. Apontar assetPrefix direto pro domínio
  // Vercel faz o browser carregar JS/CSS sem passar pela Bunny — Vercel
  // responde 200 limpo + CORS aberto. HTML continua via Bunny (funciona).
  // REVERTER quando Sidnei conseguir limpar o cache podre: deletar esta
  // linha e o Next volta a servir assets em paths relativos passando pela
  // Bunny normalmente.
  assetPrefix: 'https://landing-pages-armazem-gasolina.vercel.app',
  trailingSlash: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/fonts/:path*', headers: IMMUTABLE_CACHE },
      { source: '/pecas-lifan-:model/assets/:path*', headers: IMMUTABLE_CACHE },
    ];
  },
};

export default nextConfig;
