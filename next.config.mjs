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

// 2026-06-10: a pullzone da Bunny tem dois projetos Next.js (diesel + gasolina)
// disputando o mesmo path /_next/*, então chunks deste projeto retornam 404
// cacheado quando passam pela Bunny. Solução: apontar assetPrefix direto pro
// domínio Vercel do projeto, tirando os assets da rota Bunny de forma
// permanente. HTML continua servido pela Bunny normalmente.
// Condicional pra preservar dev local + previews Vercel — só produção usa
// o prefixo absoluto (VERCEL_ENV === 'production').
const isProd = process.env.VERCEL_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isProd ? 'https://landing-pages-armazem-gasolina.vercel.app' : undefined,
  trailingSlash: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/fonts/:path*', headers: IMMUTABLE_CACHE },
      { source: '/pecas-lifan-:model/assets/:path*', headers: IMMUTABLE_CACHE },
      { source: '/lp/:model/assets/:path*', headers: IMMUTABLE_CACHE },
    ];
  },
};

export default nextConfig;
