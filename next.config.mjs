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
  assetPrefix: '/gasolina',
  trailingSlash: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/gasolina/fonts/:path*', headers: IMMUTABLE_CACHE },
      { source: '/gasolina/:slug/assets/:path*', headers: IMMUTABLE_CACHE },
    ];
  },
};

export default nextConfig;
